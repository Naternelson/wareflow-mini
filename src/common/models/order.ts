export interface BasicOrder {
    id: number;
    organizationId: number;
    orderedOn: Date;
    dueBy: Date;
    createdAt: Date;
    updatedAt: Date;
}