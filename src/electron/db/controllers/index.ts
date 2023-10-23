import { controllers } from "../../../common/api_controller";
import { authControllers } from "./auth";


export const appControllers = controllers().merge(authControllers);

