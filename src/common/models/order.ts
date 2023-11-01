import { DeepDateToString } from "../type_helpers";
import { BasicOrderIdentifier } from "./order-identifier";
import { BasicOrderItem, OrderItemStatus } from "./order-item";

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
    data: Partial<BasicOrder>; 
    items: Partial<BasicOrderItem>[];
    secondaryIds: Partial<BasicOrderIdentifier>[];
}>



export type OrderListResponse = {
    orders: {[id:number]: OrderResponse}
    ids: number[];
    secondaryIds: {[id:number]: OrderResponse["secondaryIds"]};
};

export type OrderRequestBody = {
    dueBefore?: Date;
    dueAfter?: Date;
    limit?: number;
    offset?: number;
    organizationId?: number;
    orderId?: number | number[];
    status?: OrderItemStatus | OrderItemStatus[];
    orderBy?: "status" | "dueBy" | "orderedOn" | "customer";
    order?: "ASC" | "DESC";

}

export type SerializedOrderListResponse = DeepDateToString<OrderListResponse>;

export type SerializedOrderResponse = DeepDateToString<OrderResponse>;

