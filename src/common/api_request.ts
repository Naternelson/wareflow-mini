import { IpcRenderer } from "electron";
import axios, { AxiosRequestConfig } from "axios";
export interface ApiRequest <B = unknown, R extends object = {}>{
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    resource: string; // The endpoint to hit
    body?: B; // The body of the request
    expectedResponse?: new () => R; // The expected response type
    headers?: Record<string, string>; // Any additional headers to send
    params?: Record<string, string>; // Any query params to send
    timeout?: number; // The timeout for the request in milliseconds 
    meta?: any // Used primarily by backend middleware function to pass data to the backend
    _shape: "ApiRequest"; // This is used to ensure that the type is correct 
}

export function createApiRequest (ipcRenderer: IpcRenderer, baseUrl?: string) {
    return {
        axios: async <B, R extends object>(request: ApiRequest<B, R>) => {
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
                if (request.expectedResponse) {
                    const expectedResponse = new request.expectedResponse();
                    if (response.data) {
                        Object.assign(expectedResponse as object, response.data);
                    }
                    return expectedResponse;
                }
                return response.data;
            } catch (error) {
                console.error("Axios Error", error);
                throw error;
            }
        },
        invoke: async <B, R extends object>(request: ApiRequest<B, R>) => {
            try {
                const response = await ipcRenderer.invoke("api-call", request);
                if (request.expectedResponse) {
                    const expectedResponse = new request.expectedResponse();
                    if (response.data) {
                        Object.assign(expectedResponse as object, response.data);
                    }
                    return expectedResponse;
                }
                return response.data;
            } catch (error) {
                console.error("IPC Renderer Error", error);
                throw error;
            }
        }
    }
}
