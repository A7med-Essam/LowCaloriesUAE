export interface ICustomProgramsDetails {
    id: number,
    name: string,
    name_ar: string,
    min_meals: string,
    image: string,
    description: string,
    description_ar:string,
    custom_detail: ICustom_detail[],
    custom_prices: ICustom_prices[],
    delivery_days:IDelivery_days[]
}
export interface ICustom_detail {
    id: number,
    type: string,
    property: string,
    value: number
}
export interface ISubscriptionData{
    delivery_days: string[]
    start_date: string
    sub_days: number
}
export interface ISubscribtionDetails{
    sub_days: number,
    start_date: string,
    meal_count: number,
    snack_count: number,
    program_id:number
    delivery_days: string[]
}
export interface IMealDetails{
    id: number,
    program_id: number,
    name: string,
    name_ar: string,
    description: string,
    description_ar:string,
    image: string,
    type: string,
    carb: number,
    calories: number,
    fat: number,
    protein: number,
    main_dish: IMealItemDetails
    side_dish: IMealItemDetails
}
interface IMealItemDetails{
    item: string,
    item_ar: string,
    description: string,
    description_ar: string,
    calories: number,
    protein: number,
    fat: number,
    carb: number,
    unit: string,
    max: number,
    user_max: number
}
export interface ICategories{
    id: number,
    type: string,
    name: string,
    name_ar: string,
    meals:IMealDetails[]
}
export interface IMealDetailsUnique extends IMealDetails{
    UniqueId?:string
}
export interface ICardsOfDates{
    date: string,
    day: string,
    day_ar:string
}
interface ICustom_prices {
    price: number,
    meal_count: number
}
interface IDelivery_days {
    id: number,
    day_name: string,
    day_name_ar: string,
    closed: number
}