
export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export interface Product {
  id: string;
  name: string;
  category: 'Diagnostic' | 'Software' | 'Hardware' | 'Research';
  price: number;
  stock: number;
  description: string;
  image: string;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: number;
}

export interface SiteSettings {
  logo: string;
  contactEmail: string;
  phone: string;
  address: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  isFeatured: boolean;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  dept: string;
  category: 'leadership' | 'medical' | 'tech';
  photo: string;
  bio: string;
  linkedin?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  serviceOfInterest: string;
  status: 'new' | 'viewed' | 'replied';
  createdAt: number;
}

export interface HomeContent {
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
}
