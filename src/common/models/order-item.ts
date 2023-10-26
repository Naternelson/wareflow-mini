export enum OrderItemStatus {
    PENDING = "pending",
    QUEUED = "queued",
    ACTIVE = "active",
    COMPLETE = "complete",
    CLOSED = "closed",
    CANCELLED = "cancelled",

}
export interface BasicOrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    unit: string;
    status: OrderItemStatus;
    createdAt: Date;
    updatedAt: Date;
}