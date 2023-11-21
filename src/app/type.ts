export class Category {
    id: number;
    name: string;
    constructor(
        name: string = "",
    ) {
        this.name = name;
    }
}

export class Product {
    id: number;
    name: string;
    quantity: number;
    category: number;
    categoryName?: string;
    status: boolean;
    statusName?: string;
    createdDate: Date;
    constructor(
        category: number = 1,
        quantity: number = 0,
        name: string = "Test",
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
