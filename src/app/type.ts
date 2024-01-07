/*** ProductBrut ***/
export class ProductBrut {
    _id: string | null;
    alim_nom_fr: string;
    alim_grp_code?: number;
    alim_ssgrp_code?: number;
    alim_ssssgrp_code?: number;
    alim_grp_nom_fr?: string;
    alim_ssgrp_nom_fr?: string;
    alim_ssssgrp_nom_fr?: string;
    alim_code?: number;
    alim_nom_sci?: string;
}


/*** Category ***/
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


/*** Product ***/
export class Product {
    _id: string;
    productBrut: ProductBrut;
    quantity: number;
    unit: string | 'kg' | 'l' | 'pièce';
    category: Category | null;
    categoryName?: string;
    status: boolean;
    statusName?: string;
    createdDate: Date;
    constructor(
        productBrut = {
            _id: null,
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
        unit = 'kg',
        status: boolean = true,
        createdDate: Date = new Date()
    ) {
        this.productBrut = productBrut;
        this.quantity = quantity;
        this.unit = unit;
        this.category = category;
        this.status = status;
        this.createdDate = createdDate;
    }
}

export type ProductBody = {
    productBrutId: string,
    categoryId: string | null,
    quantity: number,
    unit: string,
    status: boolean,
    createdDate: Date
}


/*** Recipe ***/
export type IngredientRecipe = {
    _id: string,
    productBrut: {
        _id: string;
        alim_nom_fr: string;
    },
    quantity: number,
    unit: string | 'kg' | 'l' | 'pièce'
}

export class Recipe {
    _id: string;
    name: string;
    code: number;
    ingredients: IngredientRecipe[];
    imageUrl?: string;
    instructions: string;
    createdDate: Date;

    constructor(
        name: string = '',
        code: number = 0,
        ingredients: IngredientRecipe[] = [],
        instructions: string = '',
        createdDate: Date = new Date()
    ) {
        this.name = name;
        this.code = code;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.createdDate = createdDate;
    }
}

export type RecipeBody = {
    name: string;
    code: number;
    ingredients: [
        {
            // _id: string,
            productBrutId: string;
            alim_nom_fr: string;
            quantity: number;
            unit: 'kg' | 'l' | 'pièce'
        }
    ];
    imageUrl?: string;
    instructions: string;
    createdDate: Date;
}

export type RecipeExtendedQty = Recipe & {
    quantity: number;
};


/*** Recipe List ***/
export class RecipeList {
    _id: string;
    name: string;
    code: number;
    recipeIds: {
        recipeId: string;
        quantity: number;
    }[];
    shopListId: string | ShoppingList | null;
    createdDate: Date;

    constructor(
        name: string = '',
        code: number = 0,
        recipeIds: {
            recipeId: string;
            quantity: number;
        }[] = [],
        shopListId: null,
        createdDate: Date = new Date()
    ) {
        this.name = name;
        this.code = code;
        this.recipeIds = recipeIds;
        this.shopListId = shopListId;
        this.createdDate = createdDate;
    }
}

export interface RecipeListBody {
    name: string;
    recipeIds:
    {
        recipeId: string;
        quantity: number;
    }[];
    shopListId: string | null,
    createdDate: Date
}

export interface RecipListType {
    _id: string;
    name: string;
    code: number;
    recipeIds: {
        recipeId: string;
        quantity: number;
    }[];
    shopListId: string | null;
    createdDate: Date;
}

/*** Shopping List ***/
export class ShoppingList {
    _id: string;
    name: string;
    code: number;
    recipeListId: any | RecipListType | string | null;
    shopList?: ShopList;
    shopListCustomize?: IngredientShopList[];
    createdDate: Date;

    constructor(
        name: string = '',
        code: number = 0,
        recipeListId: string | null = null,
        createdDate: Date = new Date()
    ) {
        this.name = name;
        this.code = code;
        this.recipeListId = recipeListId;
        this.createdDate = createdDate;
    }
}

export interface ShoppingListBody {
    name: string;
    recipeListId: string | null;
    shopList?: ShopList;
    shopListCustomize?: IngredientShopList[];
    createdDate: Date;
}

// Flash Shop list view
export interface IngredientShopList {
    _id: string;
    quantity: number;
    unit: string;
    productBrutId: string;
    alim_nom_fr: string;
}

export interface ShopList {
    notExistInStock: IngredientShopList[] | [];
    existInStockAndNeedAdd: IngredientShopList[] | [];
}

export interface ShopListData {
    productsInStock: IngredientShopList[];
    total: IngredientShopList[];
    shopList: ShopList;
}

// User
export interface Login {
    token: string
    user: User
}

export interface User {
    _id: string
    userName: string
    firstName: string
    lastName: string
    gender: string
    email: string
    bio?: string
    roles: Role[]
    createdAt: string
    updatedAt: string
}

export interface Role {
    _id: string
    title: string
    description?: string
}
