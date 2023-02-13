export interface IMenu {
  id: number;
  name: string;
  name_ar: string;
  type: string;
  two_hundred_gram: number;
  hundred_fifty_gram: number;
  hundred_gram: number;
  meal_details: IMealDetails[];
}

export interface IMealDetails {
  calories: number;
  carb: number;
  description: string;
  description_ar: string;
  fat: number;
  id: number;
  image: string;
  item: string;
  item_ar: string;
  kilj: number;
  menu_unit: string;
  price: number;
  protein: number;
  unit: number;
}

export interface ICart {
  id?: number;
  item_id: number;
  count: number;
  total_price: number;
  created_at?: string;
  updated_at?: string;
  user_id?: number;
}

export interface IMealDetails2 {
  calories: number;
  carb: number;
  description: string;
  description_ar: string;
  fat: number;
  id: number;
  image: string;
  item: string;
  item_ar: string;
  kilj: number;
  menu_unit: string;
  price: number;
  protein: number;
  unit: number;
  cart_id: number;
}
