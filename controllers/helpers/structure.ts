export const verifyRequestStructure = (actionType: string, request: any): void => {
    if(!isIPCRequest(request)) {
        throw new Error(`Invalid request structure for action: ${actionType}`);
    }