import type {Product} from "./Products.ts";

export interface Shipment {
    id: number;
    type: string;
    product: Product,
    quantity: number;
    date: Date;
}

export interface ShipmentDetails extends Shipment {
    user: string,
    comment: string;
}

