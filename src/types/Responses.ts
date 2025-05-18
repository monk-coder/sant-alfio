import type {Product, ProductDetail, RecentlyUpdatedProduct} from "./Products.ts";
import type {RecentOperation, Operation} from "./Operations.ts";
import type {Category} from "./Categories.ts";
import type {Shipment} from "./Shipments.ts";
import type {Report} from "./Reports.ts";

export interface RestockNumberResponse {
    value: number;
}

export type RecentlyUpdatedGoodsResponse = RecentlyUpdatedProduct[]

export type RecentOperationsResponse = RecentOperation[]

export type CategoriesResponse = Category[]

export type LeftCountResponse = number[]

export type ProductsResponse = Product[]

export type ProductsDetailResponse = ProductDetail[]

export type ShipmentTypesResponse = string[]

export type ShipmentsResponse = Shipment[]

export type ReportsResponse = Report[]

export type OperationsResponse = Operation[]

