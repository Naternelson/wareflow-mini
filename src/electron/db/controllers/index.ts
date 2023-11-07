import { controllers } from "../../../common/api_controller";
import { authControllers } from "./auth";
import { ordersControllers } from "./orders";
import { productsControllers } from "./products";

export const appControllers = controllers().merge(authControllers).merge(ordersControllers).merge(productsControllers);
