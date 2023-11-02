import { controllers } from "../../../../common";
import { getOrders } from "./getOrders";

export const ordersControllers = controllers("orders");
ordersControllers.add("getOrders", getOrders);