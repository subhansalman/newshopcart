export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  sku?: string;
  inStock: boolean;
  quantity: number;
  weight?: number;
  discountedPrice?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer: Customer;
  collection: string;
  fruit: string;
  status: 'shipped' | 'processing' | 'pending' | 'delivered';
  actions?: string;
  total: number;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

export interface CurationFlow {
  id: string;
  type: string;
  category: string;
  price: string;
  trend: string;
  trendDirection: 'up' | 'down';
  delay: string;
  status: string;
  size?: string;
  curator?: string;
}

export interface StatsCard {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

export interface ChartData {
  label: string;
  values: number[];
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  email: string;
}

export type PaymentMethodType = 'apple_pay' | 'paypal' | 'card';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
}
