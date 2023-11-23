export class Category {
    _id: string;
    name: string;
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
    category: string;
    categoryName?: string;
    status: boolean;
    statusName?: string;
    createdDate: Date;
    constructor(
        quantity: number = 0,
        name: string = "",
        status: boolean = true,
        createdDate: Date = new Date()
    ) {
        this.name = name;
        this.quantity = quantity;
        this.status = status;
        this.createdDate = createdDate;
    }
}
