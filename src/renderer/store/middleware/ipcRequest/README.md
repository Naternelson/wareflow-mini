# ipcRequest

File Name `ipcRequest.ts`
Location: `/wareflow-mini/src/renderer/store/middleware/ipcRequest`
Purpose: A Redux Middleware function that handles auth requests made to the electron backend. The function will make requests to the electron backend via the ipcRenderer.invoke function.
Requests can include `signin`, `signinToken`, `updateUser`, `createUser`

## Interfaces

### Signin Request

-   The [body of the request for signin](../../../../common/models/user.ts) should be as follows:

```
    interface SigninUserBody {
        email: string;
        password: string;
        organizationId: number | null
    }
```

-   The [data of the response](../../../../common/models/user.ts) should be the AuthResponse as follows:

```
    type BasicOrganization = {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    };
    type BasicUser = {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        permission: UserPermission;
        organizationId: number;
        createdAt: Date;
        updatedAt: Date;
    }
    interface AuthResponse {
        data: {
            token: string;
            user: BasicUser;
            organization: BasicOrganization;
        };
    }
```

### Signin Token

-   The [body of the request for signinToken](../../../../common/models/user.ts) should be as follows:

```
    {}
```

-   The [data of the response](../../../../common/models/user.ts) for signinToken should be the AuthResponse as follows:

```
    type BasicOrganization = {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    };
    type BasicUser = {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        permission: UserPermission;
        organizationId: number;
        createdAt: Date;
        updatedAt: Date;
    }
    interface AuthResponse {
        data: {
            token: string;
            user: BasicUser;
            organization: BasicOrganization;
        };
    }
```

### UpdateUser

-   The [body of the request for updateUser](../../../../common/models/user.ts) should be as follows:

```
    interface UpdateUserBody {
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
    }
```

-   The data of the [data of the response](../../../../common/models/user.ts) should be the AuthResponse

### Create User

-   The [body of the request for createUser](../../../../common/models/user.ts) should be as follows:

```
    enum UserPermission {
        Admin = "admin",
        User = "user",
        Guest = "guest",
        SuperAdmin = "super_admin",
    }
    export interface CreateUserBody {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        organizationId: number;
        permission: UserPermission;
    }
```

## Actions

The Middleware should make updates to the Auth and Organizations of the Redux store. It should handle `PENDING`, `LOADING`, `SUCCESS`, `ERROR` states of the auth slice. It should update those slices accordingly. The invoke function should be handled via the [createRequestHandler function](../../../../common/api_request.ts) outlined here:

```
import { IpcRenderer } from "electron";
import axios, { AxiosRequestConfig } from "axios";
export interface ApiRequest{
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    resource: string; // The endpoint to hit
    body?: any; // The body of the request
    expectedResponse?: (response: any) => boolean // The expected response type
    headers?: Record<string, string>; // Any additional headers to send
    params?: Record<string, string>; // Any query params to send
    timeout?: number; // The timeout for the request in milliseconds
    meta?: any // Used primarily by backend middleware function to pass data to the backend
    _shape: "ApiRequest"; // This is used to ensure that the type is correct
}

export function createApiRequest (ipcRenderer: IpcRenderer, baseUrl?: string) {
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
                if (request.expectedResponse) {
                    const expectedResponse = request.expectedResponse(response.data);
                    if (expectedResponse) {
                        return expectedResponse;
                    }
                    throw new Error("Unexpected response");
                }
                return response.data;
            } catch (error) {
                console.error("Axios Error", error);
                throw error;
            }
        },
        invoke: async (request: ApiRequest) => {
            try {
                const response = await ipcRenderer.invoke("api-call", request);
                if (request.expectedResponse) {
					const expectedResponse = request.expectedResponse(response.data);
					if (expectedResponse) {
						return expectedResponse;
					}
					throw new Error("Unexpected response");
				}
                return response.data;
            } catch (error) {
                console.error("IPC Renderer Error", error);
                throw error;
            }
        }
    }
}

```
