export interface ProductRequest {
    id?: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryId: number;
    imageUrls?: string[];
}