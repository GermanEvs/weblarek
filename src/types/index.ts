// src/types/index.ts
export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment?: TPayment;
  email?: string;
  phone?: string;
  address?: string;
}

export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // IDs
}
