import { createContext, useContext, useEffect, useState } from "react";
import { Currency } from "@/interfaces";

interface CurrenciesContextType {
	listCryptoCurrencies: Currency[];
	userCurrency: {
		currency: string;
		price: number;
	}
}

const CurrenciesContext = createContext<CurrenciesContextType | undefined>(undefined)

export const CurrenciesProvider = ({ children }: { children: React.ReactNode }) => {
	const [listCryptoCurrencies, setCurrencies] = useState<Currency[]>([])
	const [userCurrency, setUserCurrency] = useState({
		currency: 'USD',
		price: 1
	});

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch('http://192.168.0.196:3000/api/cryptocurrencies');
				const currencies:Currency[] = await response.json();
				setCurrencies(currencies);
				setUserCurrency({
					currency: 'USD',
					price: currencies.find((currency: Currency) => currency.symbol === 'USD')?.price || 0
				});
			} catch (error) {
				console.error("Failed to fetch currencies:", error);
			}
		})()
	}, []);

	return (
		<CurrenciesContext.Provider value={{ listCryptoCurrencies, userCurrency }}>
			{children}
		</CurrenciesContext.Provider>
	);
}

export const useCurrencies = () => {;
	const context = useContext(CurrenciesContext);
	if (!context) {
		throw new Error("useCurrencies must be used within a CurrenciesProvider");
	}
	return context;
}

export default CurrenciesContext;