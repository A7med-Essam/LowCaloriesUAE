import { OwlOptions } from 'ngx-owl-carousel-o';

// All Programs
export const plansCustomOptions: OwlOptions = {
    dots: false,
    margin: 30,    
    responsive: {
        0: {
            items: 1,
        },
        600: {
            items: 2,
        },
        1000: {
            items: 3,
        },
        1200: {
            items: 4,
        },
    },
};

// Normal - Custom (Categories)
export const Plan_Categories_CustomOptions: OwlOptions = {
    dots: false,
    nav:true,
    navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>'],
    responsive: {
        0: {
            items: 2,
        },
        600: {
            items: 2,
        },
        1000: {
            items: 3,
        },
        1200: {
            items: 4,
        },
    },
};

export const normalPlan_Categories_CustomOptions: OwlOptions = {
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        600: {
            items: 2,
        },
        1000: {
            items: 3,
        },
        1200: {
            items: 4,
        },
    },
};

// Menu (Categories)
export const Menu_Categories_CustomOptions: OwlOptions = {
    dots: false,
    responsive: {
        0: {
            items: 2,
        },
        600: {
            items: 2,
        },
        1000: {
            items: 3,
        },
        1200: {
            items: 4,
        },
    },
};

// custom menu step 3 - step 4
export const CustomPlan_Menu_CustomOptions: OwlOptions = {
    nav:true,
    navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>'],
    dots: false,
    responsive: {
        0:{
            items:2,
        },
        600:{
            items:2,
        },
        800: {
            items: 3,
        },
        1200: {
            items: 4,
        },
    },
};

export const CustomPlan_Menu_CustomOptions2: OwlOptions = {
    dots: false,    
    nav:true,
    navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>'],
    responsive: {
        0:{
            items:1,
        },
        600:{
            items:2,
        },
        800: {
            items: 3,
        },
        1200: {
            items: 4,
        },
    },
};

// step 4 custom dates
export const CustomPlan_step4_Dates_CustomOptions: OwlOptions = {
    nav:true,
    navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>'],
    dots: false,
    items:2
};

// menu
export const menu: OwlOptions = {
    margin:20,
    dots:false,
    nav:true,
    navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>'],
    responsive:{
        0: {
            items: 1,
        },
        600:{
                items:2
            },
        1200:{
                items:4
        }
    }
};
