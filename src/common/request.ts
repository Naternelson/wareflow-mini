export class AppRequest<T extends object | null > {
    constructor(public data: T) {}
    _timestamp: number = Date.now();
    _shape: "AppRequest" = "AppRequest";
    _authToken?: string;
}

