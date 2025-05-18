import type {Shipment} from "./Shipments.ts";
import type {Product} from "./Products.ts";

export interface RecentOperation {
    id: number
    product_id: Product
    operation_id: Shipment
}

export interface Operation extends RecentOperation{
    operation_date: Date
}

export interface OperationDetail extends Operation {
    quantity_change: number
    balance_after_operation: number
    comments: string
}