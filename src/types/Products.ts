export interface RecentlyUpdatedProduct {
    id: number;
    name: string;
    category: string;
}

export interface Product extends RecentlyUpdatedProduct {
    inStockCount: number
    units: string;
}

export interface ProductDetail extends Product {
    description: string;
    size: string;
    minStockLevel: number;
    createdAt: string;
    updatedAt: string;
}