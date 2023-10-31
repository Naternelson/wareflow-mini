import { IpcRenderer } from "electron";
import axios, { AxiosRequestConfig } from "axios";
export interface ApiRequest{
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    resource: string; // The endpoint to hit
    body?: any; // The body of the request
    headers?: Record<string, string>; // Any additional headers to send
    params?: Record<string, string>; // Any query params to send
    timeout?: number; // The timeout for the request in milliseconds 
    meta?: any // Used primarily by backend middleware function to pass data to the backend
    _shape: "ApiRequest"; // This is used to ensure that the type is correct 
}



export function createApiRequest (invokeFn: IpcRenderer["invoke"], baseUrl?: string) {
    return {
        axios: async (request: ApiRequest) => {
            try {
                const axiosRequest: AxiosRequestConfig = {
                    method: request.method || "GET",
                    url: `${baseUrl}${request.resource}`,
                    data: request.body,
                    headers: request.headers,
                    params: request.params,
                    timeout: request.timeout,
                };
                const response = await axios(axiosRequest);
                return response;
            } catch (error) {
                console.error("Axios Error", error);
                throw error;
            }
        },
        invoke: async (request: ApiRequest) => {
            try {
                const response = await invokeFn("api-call", request);
                return response;
            } catch (error) {
                console.error("IPC Renderer Error", error);
                throw error;
            }
        }
    }
}
