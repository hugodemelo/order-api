export enum OrderStatus {
    Approved = "APPROVED",
    Delivered = "DELIVERED",
    Placed = "PLACED"
}

export interface Order {
    complete: boolean;
    id: number;
    quantity: number;
    shipDate: Date;
    status: OrderStatus;
    userId: number;
}
