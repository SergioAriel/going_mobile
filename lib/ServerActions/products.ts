
import { Product } from "@/interfaces";

const API_URL = "http://192.168.0.196:3000/api"; // Adjust if your web app runs on a different port

export const getOneProduct = async ({_id}: {_id: string}) => {
    const response = await fetch(`${API_URL}/products?_id=${_id}`, {
        // headers: {
        //     'Authorization': `Bearer ${token}`
        // }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }
    const { result } = await response.json();
    return result;
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

    const response = await fetch(`${API_URL}/products?${query}`, {
        // headers: {
        //     'Authorization': `Bearer ${token}`
        // }
    });
    
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const { results } = await response.json();
    console.log("response",results)
    return results;
}

