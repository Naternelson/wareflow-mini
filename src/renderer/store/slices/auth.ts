import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthResponse, BasicOrganization, BasicUser, CreateUserBody, SigninTokenBody, SigninUserBody, UpdateUserBody } from "../../../common";
// import { ipcRenderer } from "electron";
import { createApiThunk } from "../utils/createApiThunk";
import { RootState } from ".";
import { useSelector } from "react-redux";
import { DToS, DeepDateToString } from "../utils/serializedType";

export interface AuthState {
	status: "idle" | "pending" | "loading" | "success" | "error";
	token: string | null;
	user: DeepDateToString<BasicUser> | null;
	organization: DeepDateToString<BasicOrganization> | null;
	error: string | null;
}

const initialState: AuthState = {
	status: "idle",
	token: null,
	user: null,
	organization: null,
	error: null,
};


export const signin = createApiThunk<SigninUserBody>("auth/signin");
export const signinToken = createApiThunk<SigninTokenBody>("auth/signinToken")
export const updateUser = createApiThunk<UpdateUserBody>("auth/updateUser")
export const createUser = createApiThunk<CreateUserBody>("auth/createUser")

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
        signout: () => {
            return initialState
        }
    },
	extraReducers: (builder) => {
		builder
			.addCase(signin.pending, pendingAuthReducer)
			.addCase(signin.fulfilled, fulfilledAuthReducer)
			.addCase(signin.rejected, rejectedAuthReducer)
            .addCase(signinToken.pending, pendingAuthReducer)
            .addCase(signinToken.fulfilled, fulfilledAuthReducer)
            .addCase(signinToken.rejected, rejectedAuthReducer)
            .addCase(updateUser.pending, pendingAuthReducer)
            .addCase(updateUser.fulfilled, fulfilledAuthReducer)
            .addCase(updateUser.rejected, rejectedAuthReducer)
            .addCase(createUser.pending, pendingAuthReducer)
            .addCase(createUser.fulfilled, fulfilledAuthReducer)
            .addCase(createUser.rejected, rejectedAuthReducer)
	},
});

const fulfilledAuthReducer = (state: AuthState, action: PayloadAction<DToS<AuthResponse>>) => {
    state.status = "success";
    state.token = action.payload.data.token;
    state.user = action.payload.data.user;
    state.organization = action.payload.data.organization;
    state.error = null;
}
const pendingAuthReducer = (state: AuthState) => {
    state.status = "pending";
}
const rejectedAuthReducer = (state: AuthState, action: PayloadAction<any>) => {
    state.status = "error";
    state.user = null;
    state.organization = null;
    state.token = null;
    state.error = action.payload?.error?.message || null;
}


export const authReducer = authSlice.reducer;

export const useAuthSelector = () =>  useSelector<RootState, AuthState>((state) => state.auth);