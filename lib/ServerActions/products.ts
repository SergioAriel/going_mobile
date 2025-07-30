
import { Product } from "@/interfaces";

const API_URL = "http://localhost:3000/api"; // Adjust if your web app runs on a different port

export const getOneProduct = async (_id: string) => {
    const token = "YOUR_AUTH_TOKEN"; // Replace with actual token retrieval logic
    const response = await fetch(`${API_URL}/products?_id=${_id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }
    const { result } = await response.json();
    return result;
}

export const getProducts = async (find = {}, sort: { [key: string]: string } = { metacritic: "-1" }) => {
    const token = "YOUR_AUTH_TOKEN"; // Replace with actual token retrieval logic
    const query = new URLSearchParams({
        find: JSON.stringify(find),
        sort: JSON.stringify(sort)
    }).toString();

    const response = await fetch(`${API_URL}/products?${query}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const { results } = await response.json();
    return results;
}
