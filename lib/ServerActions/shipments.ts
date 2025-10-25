import { Shipment } from "@/interfaces";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface GetShipmentsParams {
    orderId?: string;
    sellerId?: string;
    status?: string;
    shippingType?: string;
}

export const getShipments = async (params: GetShipmentsParams, token: string): Promise<Shipment[]> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`${API_URL}/shipments?${query}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch shipments");
    }
    return response.json();
};

export const requestPickupForShipments = async (shipmentIds: string[], token: string) => {
    const response = await fetch(`${API_URL}/shipments/request-pickup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ shipmentIds }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to request pickup.");
    }

    return response.json();
};