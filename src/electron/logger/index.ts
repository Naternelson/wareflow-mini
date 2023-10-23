import {createLogger} from "bunyan"
import { app } from "electron";
import path from "path";
export const logger = createLogger({
    name: "wareflow-mini",
    streams: [
        {
            level: "info",
            stream: process.stdout,
        },
        {
            level: "trace",
            path: path.join(app.getPath("userData"), "trace.log"),
            type: "rotating-file",
            period: "1d",
            count: 14,
        },
        {
            type: "rotating-file",
            level: "error",
            path: path.join(app.getPath("userData"), "error.log"),
            period: "1d",
            count: 14,
        },
    ],
});