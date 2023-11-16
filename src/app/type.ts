export class Category {
    id: number;
    name: string;
    constructor(
        id: number = 0,
        name: string = "",
    ) {
        this.id = id;
        this.name = name;
    }
}

export class Product {
    id: number;
    name: string;
    quantity: number;
    category: number;
    status: boolean;
    createdDate: Date;
    constructor(
        id: number = 0,
        category: number = 1,
        quantity: number = 0,
        name: string = "",
        status: boolean = true,
        createdDate: Date = new Date()
    ) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.category = category;
        this.status = status;
        this.createdDate = createdDate;
    }
}
