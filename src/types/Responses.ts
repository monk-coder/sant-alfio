import type {Product, RecentlyUpdatedProduct} from "./Products.ts";
import type {RecentOperation, Operation} from "./Operations.ts";
import type {RecentMovement} from "./Movements.ts";
import type {Category} from "./Categories.ts";
import type {Shipment} from "./Shipments.ts";
import type {Report} from "./Reports.ts";

export interface RestockNumberResponse {
    value: number;
}

export interface RecentlyUpdatedGoodsResponse {
    data: RecentlyUpdatedProduct[]
}

export interface RecentOperationsResponse {
    data: RecentOperation[]
}

export interface RecentMovementsResponse {
    data: RecentMovement[]
}

export interface CategoriesResponse {
    data: Category[]
}

export interface LeftCountResponse {
    data: number[]
}

export interface ProductsResponse {
    data: Product[]
}

export interface ShipmentTypesResponse {
    data: string[]
}

export interface ShipmentsResponse {
    data: Shipment[]
}

export interface ReportsResponse {
    data: Report[]
}

export interface OperationsResponse {
    data: Operation[]
}
