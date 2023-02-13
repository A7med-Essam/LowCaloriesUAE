interface IMealTypes {
    id: number,
    meal_type_name: string,
    meal_type_name_ar: string,
    meal_name_backend: string
}
interface ISubscriptionDays {
    id: number,
    day_count: number
}
interface IPrices {
    meal_count: number,
    day_count: number,
    price: number
} 
interface Idelivery_days {
    id: number,
    day_name: string,
    day_name_ar: string,
    day_name_in_view:string
    closed: number
}
export interface INormalProgramDetails {
    id: number,
    image:string,
    meal_types: IMealTypes[],
    delivery_days:Idelivery_days[]
    min_meals: number,
    name: string,
    name_ar: string,
    prices: IPrices[],
    snack_price: { price: number }
    snack_types:IMealTypes[],
    subscription_days: ISubscriptionDays[],
}
interface IMeals{
    id: number
    meal_image:string
    description:string
    description_ar: string
    meal_name_ar: string
    meal_name_en: string
    meal_price: number
    meal_calories: number
    meal_carb: number
    meal_protein: number
    meal_fat: number
    unit: string
    protein: number
    calories: number
    carb: number
    fat: number
}
export interface IProgramMeals {
    category_name: string,
    category_name_ar: string
    meals:IMeals[]
}
export interface ISubscriptionData_NormalPlan {
    SnacksType:string[]
    delivery_days:string[]
    meal_types:string[]
    program_id:number
    start_date:string
    subscription_days:number
}
export interface IProgramPrice{
    program_id:number
    meal_count:number
    snack_count:number
    subscription_day_count:number
}