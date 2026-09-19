// ─── Core Types ───────────────────────────────────────────

export type Role = 'BUYER' | 'SELLER' | 'ADMIN';
export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'DONE' | 'CANCELLED';
export type BannerType = 'HERO' | 'SIDE';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  seller?: Seller;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Seller {
  id: number;
  name: string;
  slug: string;
  city: string;
  description?: string;
  bannerUrl?: string;
  avatarUrl?: string;
  isVerified: boolean;
  rating: number;
  totalSales: number;
  _count?: { products: number; orders: number };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  origPrice?: number;
  stock: number;
  weight: number;
  imageUrls: string[];
  badge?: string;
  isActive: boolean;
  rating: number;
  totalSold: number;
  seller: Seller;
  category: Category;
}

export interface CartItem {
  pid: number;
  qty: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  shippingFee: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Banner {
  id: number;
  type: BannerType;
  title: string;
  subtitle?: string;
  ctaText?: string;
  emoji?: string;
  color?: string;
  imageUrl?: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Review {
  id: number;
  userId: string;
  productId: number;
  rating: number;
  comment?: string;
  sellerReply?: string;
  user: { name: string; avatar?: string };
  createdAt: string;
}
