export class ProductBrut {
    _id: string;
    alim_grp_code: number;
    alim_ssgrp_code: number;
    alim_ssssgrp_code: number;
    alim_grp_nom_fr: string;
    alim_ssgrp_nom_fr: string;
    alim_ssssgrp_nom_fr: string;
    alim_code: number;
    alim_nom_fr: string;
    alim_nom_sci: string;
}

export class Category {
    _id: string;
    name: string;
    code: string;
    constructor(
        name: string = "",
    ) {
        this.name = name;
    }
}

export class Product {
    _id: string;
    name: string;
    quantity: number;
    category: Category;
    categoryName?: string;
    status: boolean;
    statusName?: string;
    createdDate: Date;
    constructor(
        quantity: number = 0,
        name: string = "",
        category = {
            _id: '',
            name: '',
            code: ''
        },
        status: boolean = true,
        createdDate: Date = new Date()
    ) {
        this.name = name;
        this.quantity = quantity;
        this.category = category;
        this.status = status;
        this.createdDate = createdDate;
    }
}
