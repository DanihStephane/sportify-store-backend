// src/app/models/product.model.ts
export interface Pagination {
    totalDocs: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    page: number;
    limit: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    categoryId: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductResponse {
    status: number;
    message: string;
    data: {
        pagination: Pagination;
        data: Product[];
    };
}