import { CartItem } from "@/interfaces";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface CheckoutCompletePayload {
    orderId: string;
    signature: string;
    items: CartItem[];
    buyer: {
        walletAddress: string;
        _id?: string;
        address: any; // Address interface
    };
}

export const CheckoutComplete = async (payload: CheckoutCompletePayload, token: string) => {
    const response = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Checkout completion failed: ${errorBody}`);
    }
    return await response.json();
};
