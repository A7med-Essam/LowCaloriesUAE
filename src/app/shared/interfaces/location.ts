export interface IEmirate {
    id:number,
    name:string,
    name_ar:string,
}

export interface IArea {
    id:number,
    area_ar:string,
    area_en:string,
    emirate:IEmirate|null
}

export interface IBranch {
    id: number,
    inbody_price: number,
    name: string,
    name_ar: string,
    type: string
}

export interface IBranchDetails {
    id: number
    name: string
    name_ar: string
    emirate_id: number
    mobile: string
    location_url: string
    description: string
    description_ar: string
    from: string
    to: string
}

export interface ICreateAddress {
    address: string
    landline: string
    area_id: number
}

export interface IUpdateAddress {
    address: string
    landline: string
    area_id: number
    address_id: number
}
