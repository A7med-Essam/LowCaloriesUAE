export interface IUser {
    token:string,
    name:string,
    mobile:string,
    email:string,
    id:number,
    image:string
}

export interface ILoginData {
    email:string
    password:string
}

export interface IRegisterData {
    name:string,
    email:string,
    password:string,
    mobile:string,
}

export interface IResetPassword_profile {
    old_password: string,
    password: string,
    password_confirmation: string
}

export interface IResetPassword {
    password: string
    password_confirmation: string
    token: string
    email: string
}

export interface ITranslateLang {
    name:string
    code:string
}
// TODO:remove all comments