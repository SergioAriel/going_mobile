
import { Currency } from "@/interfaces";

export const getCurrencies = async (): Promise<Currency[]> => {
    // In a real app, you would fetch this from an API
    return [
        { symbol: 'USD', name: 'US Dollar', price: 1 },
        { symbol: 'EUR', name: 'Euro', price: 0.9 },
        { symbol: 'SOL', name: 'Solana', price: 150 },
    ];
};
