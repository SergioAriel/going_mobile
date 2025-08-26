import { Order } from "@/interfaces";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getOrder = async ({ _id }: { _id: string }, token?: string): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders/${_id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch order");
    }
    return response.json();
};

export const getOrders = async (query: any, token?: string): Promise<Order[]> => {
    const urlQuery = new URLSearchParams(query).toString();
    const response = await fetch(`${API_URL}/orders?${urlQuery}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }
    return response.json();
};

export const uploadOrder = async (order: Partial<Order>, token?: string): Promise<string> => {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(order),
    });
    // if  
    const insertedId  = await response.json();
    return insertedId;
};

export const updateOrder = async (order: Partial<Order> & { _id: string }, token?: string): Promise<void> => {
    const response = await fetch(`${API_URL}/orders/${order._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        throw new Error("Failed to update order");
    }
};

export const deleteOrder = async (orderId: string, token?: string): Promise<void> => {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to delete order");
    }
};