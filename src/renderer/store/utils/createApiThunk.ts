import { IpcRenderer } from "electron";
import { ApiRequest, createApiRequest } from "../../../common";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../slices";

export function createApiThunk<T = any>(name: string, ipcRenderer: IpcRenderer){
    const apiRequest = createApiRequest(ipcRenderer)
    return createAsyncThunk(name, async (request:Omit<Partial<ApiRequest>, "body"> & {body: T}, api) => {
        const apiReq: ApiRequest = {
            ...request,
            resource: request.resource || name, 
            _shape: "ApiRequest"
        }
        const {token} = (api.getState() as RootState).auth
        if(token) {
            const headers = request.headers || {}
            apiReq.headers = {
                ...headers, 
                Authorization: `Bearer ${token}`
            }
        }
        const {data}=  await apiRequest.invoke(apiReq)
        return data 
    })
}
