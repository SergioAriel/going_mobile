export interface Product {
  _id: string;
  seller: string;
  name: string;
  addressWallet: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  status: string;
  images: Array<string | File>;
  mainImage: string;
  stock: number;
  location?: string;
  condition?: string;
  tags?: string[];
  isService?: boolean;
  isFeatured?: boolean;
  isOffer?: boolean;
  offerPercentage: number;
  reviews?: string[];
  rating: number;
  subcategory?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Currency = {
	symbol: string,
	name: string,
	price: number,
}

export interface Order {
  _id: string;
  date: Date;
  status: string;
  buyer: {
    walletAddress: string;
    _id?: string;
  };
  decryptedAddress?: AddressForm;
  sellers: string[];
  signature: string;
  driverId?: string;
  items: any[]; // Replace with actual CartItem interface
}

export interface AddressForm {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
}

export interface User {
  _id: string;
  name: string;
  addresses: any[]; // Replace with actual Address interface
  email: string;
  avatar: string;
  joined: string;
  location: string;
  bio: string;
  website: string;
  twitter: string;
  x: string;
  instagram: string;
  telegram: string;
  facebook: string;
  isSeller: boolean;
  isDriver?: boolean;
  currentLocation?: { lat: number; lng: number };
  wishlist: string[];
  settings: {
    theme: "light" | "dark" | "system";
    currency: string;
    language: string;
  }
}
