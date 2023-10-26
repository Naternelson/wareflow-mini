export interface BasicOrderIdentifier {
    id: number;
    primary: boolean; 
    orderId: number;
    organizationId: number;
    name: string;
    value: string, 
    createdAt: Date;
    updatedAt: Date;
}