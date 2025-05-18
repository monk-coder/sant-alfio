import type {Category} from "./Categories.ts";
import type {UnitOfMeasure} from "./UnitsOfMeasure.ts";

export interface RecentlyUpdatedProduct {
    id: number;
    name: string;
    category_id: Category;
}

export interface Product extends RecentlyUpdatedProduct {
    current_quantity: number
    unit_of_measure_id: UnitOfMeasure;
}

export interface ProductDetail extends Product {
    description: string;
    product_size: string;
    min_stock_level: number;
    created_at: string;
    updated_at: string;
}