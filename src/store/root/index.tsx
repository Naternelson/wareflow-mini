import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface RootState {
	currentOrder: string | null;
	currentBin: string | null;
	preferences: {
		products: {
			printTo?: {
				[labelId: string]: string; // labelId: printerId
			}
		}
	}	
}

const initialState: RootState = {
	currentOrder: null,
};

const RootSlice = createSlice({
	name: "root",
	initialState,
	reducers: {
		addInput: (state, action: PayloadAction<{ inputId: string; input: Input }>) => {
			state.activeInputs.push(action.payload.input)
		},
		resetRoot: () => {
			return initialState;
		},
		resetValues: (state) => {
			const sanitizedInputs = state.activeInputs.map( (input) => {
				return { ...input, value: "" };
			});
			state.activeInputs = sanitizedInputs;
		},
		updateInput: (state, action: PayloadAction<{ inputId: string; input: Partial<Input> }>) => {
			const i = state.activeInputs.findIndex((input) => input.id === action.payload.inputId);
			if(i === -1) return state;
			state.activeInputs[i] = { ...state.activeInputs[i], ...action.payload.input };
		},
		updateOrder: (state, action: PayloadAction<string | null>) => {
			state.currentOrder = action.payload;
		},
	},
});

export const rootReducer = RootSlice.reducer;
export const { addInput, resetRoot, resetValues, updateInput, updateOrder } = RootSlice.actions;


export const getInputById = (inputId:string) => (state:RootState) => state.activeInputs.find( (input) => input.id === inputId );
export const getCurrentOrderId = (state:RootState) => state.currentOrder