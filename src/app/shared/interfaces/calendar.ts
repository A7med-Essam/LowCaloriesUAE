export interface IPlanDetails {
    date: string
    day_name: string
    meals:IMeals[]
}


export interface IMeals {
    id: number
    meal_name: string
    calories: number
    carb: number
    fats: number
    protiens: number
}

export interface IPlanWeeks {
    dayId: number
    dayname: string
    meals: IWeekMeals[]
}

export interface IWeekMeals {
    mealType: number
    mealName: string
    calories: number
    carb: number
    fats: number
    protiens: number
}

export interface IDayDetails {
    date: string
    day_name: string
    meals:IMeals[]
}