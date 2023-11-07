import { controllers } from "../../../../common";
import { getProducts } from "./getProducts";

export const productsControllers = controllers("products");
productsControllers.add("getProducts", getProducts);
