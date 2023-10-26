export enum ProductIdentifierType {
    UPC = 'UPC',
    EAN = 'EAN',
    ISBN = 'ISBN',
    ASIN = 'ASIN',
    GTIN = 'GTIN',
    SKU = 'SKU',
    MPN = 'MPN',
    PART_NUMBER = 'PART_NUMBER',
    SERIAL_NUMBER = 'SERIAL_NUMBER',
    OTHER = 'OTHER',
}
export type BasicProductIdentifier = {
    id: number;
    productId: number;
    organizationId: number;
    primary: boolean;
    type: ProductIdentifierType; 
    name: string;
    value: string,
    createdAt: Date;
    updatedAt: Date;
};