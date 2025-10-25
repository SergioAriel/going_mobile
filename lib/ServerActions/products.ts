import { Product } from "@/interfaces";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Public endpoint, no token needed
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

// Public endpoint, no token needed
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

// Protected endpoint, token required
export const uploadProduct = async (product: FormData, token: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: product,
    });
    if (!response.ok) {
        throw new Error("Failed to upload product");
    }
    return response.json();
};

// Protected endpoint, token required
export const updateProduct = async (product: Partial<Product> & { _id: string }, token: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product),
    });
    if (!response.ok) {
        throw new Error("Failed to update product");
    }
    return response.json();
};

// Protected endpoint, token required
export const deleteProduct = async (productId: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to delete product");
    }
};