import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Bin {
	id: string;
	productId: string[];
	quantityByProduct: {
		[productId: string]: number;
	};
	total: number;
	devices: string[]; // Unique device ids;
    maxQuantity?: number;
    printTo?: string;
    autoPrint?: boolean
}

export interface BinsState {
	[binId: string]: Bin;
}

const initialState: BinsState = {};

const slice = createSlice({
	name: "bins",
	initialState,
	reducers: {
		upsertBins: (state, action: PayloadAction<BinsState>) => {
			Object.assign(state, action.payload);
		},
		deleteBins: (state, action: PayloadAction<string[]>) => {
			action.payload.forEach((binId) => {
				delete state[binId];
			});
		},
		resetBins: () => initialState,
		insertDevice: (state, action: PayloadAction<{ binId: string; deviceId: string; productId: string }>) => {
			const bin = state[action.payload.binId];
			// Exit early if bin doesn't exist
			if (!bin) return state;
			const { deviceId, productId } = action.payload;

			// If the device is already logged, exit without updating
			if (bin.devices.includes(deviceId)) return state;

			// Add new device ID
			bin.devices = [...bin.devices, deviceId];

			// Add new product ID if it doesn't exist in the array
			if (!bin.productId.includes(productId)) {
				bin.productId = [...bin.productId, productId];
			}

			// Update the quantity for the specific product
			bin.quantityByProduct[productId] = (bin.quantityByProduct[productId] || 0) + 1;

			// Increase the total count
			bin.total++;
		},
		deleteDevice: (state, action: PayloadAction<{ binId: string; deviceId: string; productId: string }>) => {
			const bin = state[action.payload.binId];
			// Exit early if bin doesn't exist
			if (!bin) return state;
			const { deviceId, productId } = action.payload;

			// If the device is not logged, exit without updating
			if (!bin.devices.includes(deviceId)) return state;

			// Remove the device ID
			bin.devices = bin.devices.filter((id) => id !== deviceId);

			// Decrease the quantity for the specific product
			bin.quantityByProduct[productId] = (bin.quantityByProduct[productId] || 0) - 1;

			// If the product quantity becomes 0 after removal, remove the product from productId array
			if (bin.quantityByProduct[productId] === 0) {
				bin.productId = bin.productId.filter((id) => id !== productId);
				delete bin.quantityByProduct[productId]; // Optionally, remove the product key from the quantity map
			}

			// Decrease the total count
			bin.total--;
		},
	},
});

export const { upsertBins, deleteBins, resetBins, insertDevice, deleteDevice } = slice.actions;
export const binsReducer = slice.reducer;

export const getBinById = (binId: string) => (state: BinsState) => state[binId];
