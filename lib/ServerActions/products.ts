import { Product } from "@/interfaces";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getOneProduct = async ({_id}: {_id: string}) => {
    const response = await fetch(`${API_URL}/products/${_id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }
    return response.json();
}

interface GetProductsParams {
    find?: Record<string, any>;
    sort?: Record<string, any>;
}

export const getProducts = async ({ find = {}, sort = { metacritic: -1 } }: GetProductsParams) => {
    const query = new URLSearchParams({
        find: JSON.stringify(find),
        sort: JSON.stringify(sort)
    }).toString();

    const response = await fetch(`${API_URL}/products?${query}`);
    
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    return response.json();
}

export const uploadProduct = async (product: FormData): Promise<Product> => {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        body: product,
    });
    if (!response.ok) {
        throw new Error("Failed to upload product");
    }
    return response.json();
};

export const updateProduct = async (product: Partial<Product> & { _id: string }): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
    if (!response.ok) {
        throw new Error("Failed to update product");
    }
    return response.json();
};

export const deleteProduct = async (productId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error("Failed to delete product");
    }
};