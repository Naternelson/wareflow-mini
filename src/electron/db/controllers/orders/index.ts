import { controllers } from "../../../../common";
import { getOrders } from "./getOrders";
import { newOrder } from "./newOrder";

export const ordersControllers = controllers("orders");
ordersControllers.add("getOrders", getOrders);
ordersControllers.add("newOrder", newOrder);