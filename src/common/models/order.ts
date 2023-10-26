import { ProductIdentifier } from "../../electron/db/models";
import { BasicBin } from "./bin";
import { BasicOrderIdentifier } from "./order-identifier";
import { BasicOrderItem } from "./order-item";
import { ProductResponse } from "./product";
import { BasicProductItem } from "./product_item";

export interface BasicOrder {
    id: number;
    organizationId: number;
    orderedOn: Date;
    dueBy: Date;
    customer: string; 
    createdAt: Date;
    updatedAt: Date;
}

export type OrderResponse = Partial<{
    order: Partial<BasicOrder>;
    primaryOrderIdentifier: Partial<BasicOrderIdentifier>;
    secondaryOrderIdentifiers: Partial<BasicOrderIdentifier>[];
	products: Partial<{ [id: number]: ProductResponse}>;
    items: BasicOrderItem[];
    bins: { [id: number]: Partial<BasicBin> };
    productItems: { [id: number]: Partial<BasicProductItem>[] };
}>;

export type OrderListResponse = {
    orders: {[id:number]: OrderResponse}
    internalIdentifiers: number[];
    primaryIdentifiers: BasicOrderIdentifier[];
};