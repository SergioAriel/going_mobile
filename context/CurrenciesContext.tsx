import { createContext, useContext, useEffect, useState } from "react";
import { getCurrencies } from "@/lib/ServerActions/cryptocurrencies";
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
			const currencies:Currency[] = await getCurrencies();
			setCurrencies(currencies);
			setUserCurrency({
				currency: 'USD',
				price: currencies.find((currency: Currency) => currency.symbol === 'USD')?.price || 0
			});
		})()
	}, []);

	return (
		<CurrenciesContext.Provider value={{ listCryptoCurrencies, userCurrency }}>
			{children}
		</CurrenciesContext.Provider>
	);
}

export const useCurrencies = () => {
	const context = useContext(CurrenciesContext);
	if (!context) {
		throw new Error("useCurrencies must be used within a CurrenciesProvider");
	}
	return context;
}