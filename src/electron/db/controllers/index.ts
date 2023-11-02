import { controllers } from "../../../common/api_controller";
import { authControllers } from "./auth";
import { ordersControllers } from "./orders";


export const appControllers = controllers().merge(authControllers).merge(ordersControllers);

