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
    productBrut: ProductBrut;
    quantity: number;
    category: Category | null;
    categoryName?: string;
    status: boolean;
    statusName?: string;
    createdDate: Date;
    constructor(
        productBrut = {
            _id: '',
            alim_grp_code: 0,
            alim_ssgrp_code: 0,
            alim_ssssgrp_code: 0,
            alim_grp_nom_fr: '',
            alim_ssgrp_nom_fr: '',
            alim_ssssgrp_nom_fr: '',
            alim_code: 0,
            alim_nom_fr: '',
            alim_nom_sci: '',
        },
        category = {
            _id: '',
            name: '',
            code: ''
        },
        quantity: number = 0,
        status: boolean = true,
        createdDate: Date = new Date()
    ) {
        this.productBrut = productBrut;
        this.quantity = quantity;
        this.category = category;
        this.status = status;
        this.createdDate = createdDate;
    }
}

export type ProductBody = {
    productBrutId: string,
    categoryId: string | null,
    quantity: number,
    status: boolean,
    createdDate: Date
}
