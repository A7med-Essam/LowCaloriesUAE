import { IBoot } from "./boot"
import { ICheckOutPrice } from "./checkout"
import { IClinic, IClinicDates } from "./clinic"
import { ICardsOfDates, ICategories, ICustomProgramsDetails } from "./customPlan"
import { IArea, IBranch, IBranchDetails, IEmirate } from "./location"
import { IMenu } from "./menu"
import { INormalProgramDetails, IProgramMeals } from "./normalPlan"
import { ILayers, IPrograms } from "./plans"
import { IProfilePlans, IUserProfile, IUserProfile_Address } from "./profile"
import { ISocialMedia } from "./socialMedia"
import { ITerms } from "./terms"
// default
export interface IDefaultResponse {
    status: number
    message: string,
    data:string
}
// Auth
export interface IAuthResponse {
    status: number
    message: string,
    data:IUserProfile
}
// boot
export interface IBootResponse {
    status: number
    message: string,
    data:IBoot[]
}
// clinic
export interface IClinicResponse {
    status: number
    message: string,
    data:IClinic[]
}
export interface IClinicDatesResponse {
    status: number
    message: string,
    data:IClinicDates
}

// custom plan
export interface ICustomProgramsDetailsResponse {
    status: number,
    message: string,
    data:ICustomProgramsDetails
}

export interface ICategoriesResponse{
    status: number,
    message: string,
    data: ICategories[]
}

export interface ICardsOfDatesResponse{
    status: number,
    message: string,
    data: {
        card_dates: ICardsOfDates[],
        meal_count: number,
        snack_count: number,
        delivery_days: string[],
        start_date: string,
        price:  number,
        vat: number,
        grand_total:  number,
        code_apply:  number,
        bag_price: number,
        subscription_days:number,
        program_type: string,
        program_company: string,
        program_name: string
    }
}

// normal plans
export interface INormalProgramDetailsResponse {
    status: number
    message: string,
    data:INormalProgramDetails
}
export interface IProgramMealsResponse {
    status: number
    message: string,
    data:IProgramMeals[]
}
// Layers
export interface ILayersResponse {
    status: number
    message: string,
    data:ILayers[]
}
// All programs
export interface IProgramsResponse {
    status: number
    message: string,
    data:IPrograms[]
}
// user plans
export interface IProfilePlansResponse {
    status: number
    message: string,
    data:IProfilePlans[]
}
// profile
export interface IProfileResponse {
    status: number
    message: string,
    data:IUserProfile
}
// checkout
export interface ICheckOutPriceResponse {
    status: number
    message: string,
    data:ICheckOutPrice
}
// location
export interface IEmirateResponse {
    status: number
    message: string,
    data:IEmirate[]
}
export interface IAreasResponse {
    status: number
    message: string,
    data:IArea[]
}
export interface IAddressResponse {
    status: number
    message: string,
    data:IUserProfile_Address[]
}
// branches
export interface IBranchResponse {
    status: number
    message: string,
    data:IBranch[]
}
export interface IBranchDetailsResponse {
    status: number
    message: string,
    data:IBranchDetails[]
}
// menu
export interface IMenuResponse {
    status: number
    message: string,
    data:IMenu[]
}
// Social media
export interface ISocialMediaResponse {
    status: number
    message: string,
    data:ISocialMedia[]
}
// Terms
export interface ITermsResponse {
    status: number
    message: string,
    data:ITerms[]
}