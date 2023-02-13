export interface ICustomCheckOut_WithAuth {
  subscription_days: number;
  program_id: number;
  meal_count: number;
  snack_count: number;
  delivery_days: string[];
  start_date: string;
  price: number;
  total_price: number;
  address_id?: number;
  area_id?: number;
  address?: number;
  subscription_from: string;
}

export interface INormalCheckOut_WithAuth {
  meal_count: number;
  subscription_days: number;
  program_id: number;
  meal_backend_types: string[];
  snack_backend_types: string[];
  delivery_days: string[];
  start_date: string;
  price: number;
  total_price: number;
  address_id?: number;
  area_id?: number;
  address?: number;
  subscription_from: string;
}

export interface INormalCheckOut {
  subscription_days: number;
  program_id: number;
  meal_count: number;
  meal_backend_types: string[];
  snack_backend_types: string[];
  delivery_days: string[];
  start_date: string;
  price: number;
  total_price: number;
  name: string;
  email: string;
  mobile: string;
  area_id: number;
  address: string;
  landline: number;
  subscription_from: string;
}

export interface ICustomCheckOut {
  subscription_days: number;
  program_id: number;
  meal_count: number;
  snack_count: number;
  delivery_days: string[];
  start_date: string;
  price: number;
  total_price: number;
  name: string;
  email: string;
  mobile: string;
  area_id: number;
  address: string;
  landline: number;
  subscription_from: string;
}

export interface IClinicCheckOutSubInfo {
  email: string;
  name: string;
  mobile: string;
  day: string;
  max_people: number;
  emirate_id: number;
  area_id: number;
  time_id: number;
  date: string;
  address?: string;
  subscription_from: string;
}

export interface IGiftCode {
  code: string;
  price: string;
  program_id: string;
}

export interface IGiftCode_menu {
  code: string;
  price: number;
  item_ids: number[];
}

export interface ICheckOutPrice {
  price: number;
  code_apply: number;
  vat: number;
  grand_total: number;
  bag_price: number;
}

export interface IReceipt_WithAuth {
  cart_item_ids: number[];
  start_date: string;
  delivery_days: string[];
  price: number;
  total_price: number;
  subscription_from: string;
  address_id: number;
}

export interface IReceipt_WithoutAuth {
  item_ids: number[];
  start_date: string;
  delivery_days: string[];
  price: number;
  total_price: number;
  subscription_from: string;
  name: string;
  email: string;
  address: string;
  area_id: number;
  mobile: string;
}
