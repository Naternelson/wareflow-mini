import { ApiRequest, createApiRequest } from "../../../common";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../slices";

type BasicRequest<T = any> = Omit<Partial<ApiRequest>, "body"> & {body: T}

export function createApiThunk<T = any>(name: string){
    const apiRequest = createApiRequest(window.electron.invoke)
    return createAsyncThunk(name, async (request:BasicRequest<T>, api) => {
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
        const data =  await apiRequest.invoke(apiReq)
        return data
    })
}
