interface ITimes{
    id: number,
    time_from: string,
    time_to: string,
    emirate_appointment_id: number,
    booked: number
}

export interface IOnlineAppointments{
    id: number,
    type: string,
    emirate_id: number,
    day: string,
    date: string,
    max_people: string,
    times:ITimes[]
}

export interface IClinic{
    id: number,
    name: string,
    name_ar: string,
    inbody_price: number,
    online_appointments: IOnlineAppointments[]
}

export interface IWhatsAppMsg{
    email: string,
    emirate: string,
    mobile: string,
    name:string,
    whatsApp: string,
    date:string,
    day:string,
    max_people:number
}

export interface IClinicDates{
    date_lock: string[],
    date_unlock: string[],
    min_date: string
    max_date: string
}