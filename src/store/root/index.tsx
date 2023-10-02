import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Input {
	value: string;
	regex: string;
	isValid: boolean | null;
	isTouched: boolean;
	isRequired: boolean;
	printTo: null | string;
	printLabel: null | string | string[];
	autoPrint: boolean;
}

interface RootState {
	currentOrder: string | null;
	activeInputs: {
		[inputId: string]: Input;
	};
}

const initialState: RootState = {
	currentOrder: null,
	activeInputs: {},
};

const RootSlice = createSlice({
	name: "root",
	initialState,
	reducers: {
		addInput: (state, action: PayloadAction<{ inputId: string; input: Input }>) => {
			state.activeInputs[action.payload.inputId] = action.payload.input;
		},
		resetRoot: () => {
			return initialState;
		},
		resetValues: (state) => {
			const sanitizedInputs = Object.keys(state.activeInputs).reduce((acc, inputId) => {
				acc[inputId] = { ...state.activeInputs[inputId], value: "", isValid: null, isTouched: false };
				return acc;
			}, {} as RootState["activeInputs"]);
			state.activeInputs = sanitizedInputs;
		},
		updateInput: (state, action: PayloadAction<{ inputId: string; input: Partial<Input> }>) => {
			state.activeInputs[action.payload.inputId] = {
				...state.activeInputs[action.payload.inputId],
				...action.payload.input,
			};
		},
		updateOrder: (state, action: PayloadAction<string | null>) => {
			state.currentOrder = action.payload;
		},
	},
});

export const rootReducer = RootSlice.reducer;
export const { addInput, resetRoot, resetValues, updateInput, updateOrder } = RootSlice.actions;


export const getInputById = (inputId:string) => (state:RootState) => state.activeInputs[inputId]