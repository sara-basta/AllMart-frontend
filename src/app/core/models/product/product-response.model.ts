import { ProductImage } from "./product-image.model";

export interface ProductResponse {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryName: string;
    images: ProductImage[];
    averageRating?: number;
    reviewCount?: number;
}