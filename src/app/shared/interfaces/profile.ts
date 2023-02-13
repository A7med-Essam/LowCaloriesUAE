// export interface IProfileResponse {
//     status: number,
//     message: string,
//     data: IProfile
// }

// export interface IProfile {
//     addresses: IAddresses[],
//     email: string,
//     has_profile:string,
//     id: number,
//     mobile: string,
//     name: string,
//     password:string,
//     token: string,
//     profile: {
//         gender:string,
//         second_mobile: string,
//         height:number,
//         weight:number,
//         date_of_birth:string,
//     },
// }

// export interface IAddresses {
//     id: number,
//     address: string,
//     landline: string,
//     area: {
//         id: number,
//         area_ar: string,
//         area_en: string,
//         emirate: {
//             id: number,
//             name_ar: string,
//             name: string
//             type: string
//             inbody_price: number
//         }
//     }
// }

// export interface IResetPassword {
//     old_password: string,
//     password: string,
//     password_confirmation: string
// }

// export interface IUpdateProfileResponse {
//     status: number,
//     message: string,
//     data: IUpdateProfile
// }

// export interface IUpdateProfile {
//     addresses: IAddresses[]
//     email: string
//     has_profile: string
//     id: number
//     mobile: string
//     name: string
//     password: string
//     profile: {
//         date_of_birth: string
//         gender: string
//         height: number
//         second_mobile: string
//         weight: number
//     }
//     token: string
// }

// new ******************************

export interface IUserProfile {
  id: 127;
  name: string;
  email: string;
  mobile: string;
  password: string;
  access_token: string;
  image: string;
  has_profile: string;
  profile: {
    second_mobile: string;
    date_of_birth: string;
    height: number;
    weight: number;
    gender: string;
  };
  addresses: IUserProfile_Address[];
}

export interface IUserProfile_Address {
  id: number;
  address: string;
  landline: any;
  area: {
    id: number;
    area_ar: string;
    area_en: string;
    emirate: {
      id: number;
      name: string;
      name_ar: string;
      type: string;
      inbody_price: number;
    };
  };
}

export interface IUpdateProfile {
  date_of_birth: string;
  height: string;
  weight: string;
  second_mobile: string;
  gender: string;
  name: string;
  email: string;
  mobile: string;
}

export interface IProfilePlans {
  cid: number;
  plan_title: string;
  remaining_days: number;
  status: string;
  image: string;
}
