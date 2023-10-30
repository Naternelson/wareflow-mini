import { ApiRequest } from "./api_request";
import { toCamelCase } from "./string_helper";


export type RequestHandler= (request: ApiRequest) => Promise<unknown>;
type Controller =  {
    add: (name: string, handler: RequestHandler) => void;
    get: (name: string) => RequestHandler | undefined;
    names: () => string[];
    getHandlers: () => Map<string, RequestHandler>;
    merge: (controller: Controller) => Controller
}
export const controllers = (preface?: string): Controller => {
    const handlers = new Map<string, RequestHandler>();
    preface && (preface = toCamelCase(preface));
    return {
		add: (name: string, handler: RequestHandler) => {
			if (preface) name = `${preface}/${toCamelCase(name)}`;
			handlers.set(name, handler);
		},
		get: (name: string) => {
			if (preface) name = `${preface}/${toCamelCase(name)}`;
			return handlers.get(name);
		},
		names: () => {
			return Array.from(handlers.keys());
		},
		getHandlers: () => {
			return handlers;
		},
		merge: (...mergeControllers: Controller[]) => {
            const newController = controllers(preface);
            const newHandlers = newController.getHandlers();
            mergeControllers.forEach((controller) => {
				controller.getHandlers().forEach((handler, name) => {
					newHandlers.set(name, handler);
				});
			});
            handlers.forEach((handler, name) => {
                newHandlers.set(name, handler);
            });
            return newController;

		},
	};
}
