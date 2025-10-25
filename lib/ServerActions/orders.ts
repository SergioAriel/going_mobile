import { NewOrderPayload, Order } from "@/interfaces";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const createPendingOrder = async (payload: NewOrderPayload, token: string): Promise<string> => {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to create pending order: ${errorBody}`);
    }
    const data = await response.json();
    return data.insertedId;
};

export const getOrders = async (find: Record<string, any>, token: string): Promise<Order[]> => {
    const query = new URLSearchParams({ find: JSON.stringify(find) }).toString();
    const response = await fetch(`${API_URL}/orders?${query}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }
    return response.json();
};

export const getOrder = async (orderId: string, token: string): Promise<Order | null> => {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        return null;
    }
    return response.json();
};