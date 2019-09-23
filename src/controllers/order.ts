import { NextFunction, Request, Response } from "express";
import { Order, OrderStatus } from "../model/order";

let orders: Array<Order> = [];

const getOrderFromList = (id: string): Order => orders.find(obj => obj.id === Number(id));

export const getOrder = (req: Request, res: Response, next: NextFunction) => {
    const order = getOrderFromList(req.params.id);
    
    const httpCode = order ? 200 : 404;
    return res.status(httpCode).send(order);
};

export const addOrder = (req: Request, res: Response, next: NextFunction) => {
    const order: Order = {
        complete: false,
        id: Math.floor(Math.random() * 100) + 1,
        quantity: req.body.quantity,
        shipDate: req.body.shipDate,
        status: OrderStatus.Placed,
        userId: req.body.userId
    };
    orders.push(order);
    return res.status(201).send(order);
};

export const removeOrder = (req: Request, res: Response, next: NextFunction) => {
    const order = getOrderFromList(req.params.id);

    if (!order) {
        return res.status(404).send();
    }

    orders = orders.filter(obj => obj.id !== order.id);
    return res.status(204).send();
};
