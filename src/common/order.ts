import { SanitizedAddress } from "./helpers"

export enum OrderStatus {
    QUEUED = "QUEUED",
    PICKING = "PICKING",
    ASSEMBLY = "ASSEMBLING",
    PAUSED = "PAUSED",
    ERROR = "PROBLEM",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    DELIVERED = "DELIVERED",
}

export type SanitizedOrder= Partial<{
    id: number
    organizationId: number
    customerId: number
    dueOn: Date
    receivedDate: Date
    deliverToId: number
    createdAt: Date
    updatedAt: Date
}>

export type SanitizedProduct = Partial<{
    id: number
    name: string
    organizationId: number
    description: string
    createdAt: Date
    updatedAt: Date
}>


export type SanitizedOrderItem = Partial<{
    id: number
    orderId: number
    productId: number
    quantityOrdered: number
    quanityAvailable: number
    status: OrderStatus
    createdAt: Date
    updatedAt: Date
}>

export type SanitizedCustomer = Partial<{
    id: number
    name: string
    address: SanitizedAddress
    createdAt: Date
    updatedAt: Date
}>



export type OrderResponse  = SanitizedOrder & {
    items: (SanitizedOrderItem & {product: SanitizedProduct})[]
    customer: SanitizedCustomer
}

export type OrdersResponse = OrderResponse[]

