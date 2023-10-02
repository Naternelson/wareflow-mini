import fs from "fs";
import path from "path";
import { fromPath } from "pdf2pic";
import { v4 as uuid } from "uuid";
import { getDefaultPrinter, print, PrintOptions } from "pdf-to-printer";
import { app, BrowserWindow, IpcMainEvent, PrintToPDFOptions } from "electron";
import { Options } from "pdf2pic/dist/types/options";

// Default settings for PDF generation.
const DEFAULT_SETTINGS: PrintToPDFOptions = {
	margins: {
		marginType: "custom",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	printBackground: false,
};
const LABEL_PATH = path.join(__dirname, "public", "labels");
const THUMBNAIL_DIR = path.join(app.getPath("temp"), "thumbnails");
if (!fs.existsSync(THUMBNAIL_DIR)) {
	fs.mkdirSync(THUMBNAIL_DIR);
}
/**
 * Options for label printing.
 */
export interface PrintLabelOptions {
	printer?: string;
	copies?: number;
	template: {
		name: string;
		width: number;
		height: number;
	};
	data?: any; // This will be used in the future for dynamic labels.
}

/**
 * Generates a print job for a given label.
 *
 * @param {Electron.IpcMainEvent} event - The Electron IPC event object.
 * @param {PrintLabelOptions} options - The label printing options.
 */
export function printLabel(event: Electron.IpcMainEvent, options: PrintLabelOptions) {
	const {
		template: { name },
	} = options;
	const labelWindow = new BrowserWindow({
		show: false,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	labelWindow.loadURL(`file://${path.join(LABEL_PATH, `${name}.html`)}`);
	labelWindow.webContents.on("did-finish-load", handlePrintAfterLoad(event, labelWindow, options));
}

/**
 * Sends the print job to the designated printer.
 *
 * @param {Electron.IpcMainEvent} event - The Electron IPC event object.
 * @param {Object} message - Message with print status and other details.
 * @param {string} filepath - Path to the PDF file to be printed.
 * @param {PrintOptions} options - Options for printing.
 */
export const sendPrintJob = async (
	event: Electron.IpcMainEvent,
	message: { id: string; status: string; printer: string; errorType?: string },
	filepath: string,
	options?: PrintOptions
) => {
	try {
		await print(filepath, options);
		event.reply("print-status", { ...message, status: "success" });
	} catch (error) {
		console.error(error);
		event.reply("print-status", { ...message, status: "error", errorType: error });
	} finally {
		fs.unlink(filepath, (err) => err && console.error(err));
	}
};

/**
 * Handles printing errors.
 *
 * @param {Electron.IpcMainEvent} event - The Electron IPC event object.
 * @param {Object} message - Message with print status and other details.
 * @param {any} error - The error to handle.
 */
const handleError = (event: IpcMainEvent, message: any, error: any) => {
	console.error(error);
	event.reply("print-status", { ...message, status: "error", errorType: error });
};

/**
 * Handler to process print job after the label content has finished loading.
 *
 * @param {Electron.IpcMainEvent} event - The Electron IPC event object.
 * @param {BrowserWindow} labelWindow - The Electron window containing the label content.
 * @param {PrintLabelOptions} options - The label printing options.
 * @returns {Function} - The function to execute after the label has loaded.
 */
const handlePrintAfterLoad =
	(event: IpcMainEvent, labelWindow: BrowserWindow, options: PrintLabelOptions) => async () => {
		const { printer, copies, template } = options;
		const { width, height } = template;
		const pdfOptions: PrintToPDFOptions = {
			...DEFAULT_SETTINGS,
			pageSize: { width, height },
		};
		const dataBuffer = await labelWindow.webContents.printToPDF(pdfOptions);
		const id = uuid();
		const filepath = path.join(app.getPath("temp"), `${id}.pdf`);
		const currentPrinter = printer || (await getDefaultPrinter());
		if (!currentPrinter)
			return handleError(event, { id, status: "error", printer: currentPrinter }, "No printer selected");
		const printerMessage:any = {
			id,
			status: "pending",
			printer: typeof currentPrinter === "string" ? currentPrinter : currentPrinter.name,
		};
		try {
			fs.writeFileSync(filepath, dataBuffer);
			const thumbnail = await generateThumbnail(filepath, width, height, id);
            if (thumbnail) printerMessage.image = thumbnail.base64;
			event.reply("print-status", printerMessage);
			await sendPrintJob(event, printerMessage, filepath, { printer: printerMessage.printer, copies });
		} catch (error) {
			handleError(event, printerMessage, error);
		} finally {
			labelWindow.close();
			fs.unlink(filepath, (err) => err && console.error(err));
		}
	};
export const generateThumbnail = async (pdfPath: string, width: number, height: number, id: string) => {
	const baseWidth = 200;
	const aspectRatio = width / height;
	const thumbnailHeight = Math.round(baseWidth * aspectRatio);
	const opts: Options = {
		density: 100,
		width: baseWidth,
		height: thumbnailHeight,
		saveFilename: id,
		savePath: THUMBNAIL_DIR,
		format: "png",
		quality: 100,
	};
	const convert = fromPath(pdfPath, opts);
	try {
		return await convert(1, { responseType: "base64" });
	} catch (err) {
		console.error("Thumbnail generation failed:", err);
		return null;
	}
};

export const cleanupThumbnail = (id: string) => {
	const thumbnailPath = path.join(app.getPath("temp"), "thumbnails", `${id}.png`);
	fs.unlink(thumbnailPath, (err) => err && console.error(err));
};
