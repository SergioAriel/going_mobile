export interface User {
  _id: string;
  name: string;
  addresses: Address[];
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

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  lat?: number;
  lng?: number;
}

export interface CreateProduct {
  seller: string;
  stock?: number;
  location?: string;
  condition?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  images: any[]; // Changed from File[] for mobile compatibility
  tags?: string;
  isService?: boolean;
  addressWallet?: string;
}

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
  images: string[];
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

export interface CartItem extends Partial<Product> {
  _id: string;
  seller: string;
  name: string;
  price: number;
  mainImage: string;
  quantity: number;
  addressWallet: string;
  currency: string;
  isOffer?: boolean;
  offerPercentage: number;
}

export interface Order {
  _id: string;
  date: Date;
  status: 'payment_pending' | 'payment_confirmed' | 'ready_to_ship' | 'shipped' | 'delivered' | 'cancelled' | 'payment_failed';
  buyer: {
    walletAddress: string;
    _id?: string;
  };
  decryptedAddress?: AddressForm;
  sellers: string[];
  signature: string;
  driverId?: string;
  items: CartItem[];
}

export interface Shipment {
  _id: string;
  orderId: string;
  sellerId: string;
  driverId: string;
  status: 'pending_assignment' | 'en_route_to_pickup' | 'in_transit' | 'delivered';
  items: Order['items'];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderWithEncryptedAddress extends Omit<Order, 'decryptedAddress'> {
  encryptedAddress: EncryptedData;
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
  lat?: number;
  lng?: number;
}

export interface EncryptedData {
  iv: string;
  content: string;
  tag: string;
}

export interface Review {
  _id: string;
  text: string;
  rating: number;
  productId: string;
  userId: string;
  createdAt: Date;
}

export type Currency = {
	symbol: string,
	name: string,
	price: number,
}