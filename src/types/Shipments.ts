import type {Product} from "./Products.ts";

export interface Shipment {
    id: number;
    operation_type: string;
    product_id: Product,
    quantity: number;
    operation_date: Date;
}

export interface ShipmentDetails extends Shipment {
    user_id: string,
    comment: string;
}

