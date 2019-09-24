import { NextFunction, Request, Response } from "express";
import { Order, OrderStatus } from "../model/order";
import { buildResponse, HttpCode, LinkBuilder } from "../utils";

let orders: Array<Order> = [];

const getOrderFromList = (id: string): Order => orders.find(obj => obj.id === Number(id));

export const getOrder = (req: Request, res: Response, next: NextFunction) => {
    let order = getOrderFromList(req.params.id);

    let httpCode = HttpCode.NOT_FOUND;
    if (order) {
        httpCode = HttpCode.OK;
        order = new LinkBuilder(order).rel("self").orders().id(order.id).build();
        order = new LinkBuilder(order).rel("user").users().id(order.userId).build();
    }
    return buildResponse(res, order, httpCode);
};

export const getAllOrders = (req: Request, res: Response, next: NextFunction) => {
    const status = req.query.status;
    const filteredOrders = status ? orders.filter(order => order.status === status) : orders;
    return buildResponse(res, filteredOrders, HttpCode.OK);
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
    return buildResponse(res, order, HttpCode.CREATED);
};

export const removeOrder = (req: Request, res: Response, next: NextFunction) => {
    const order = getOrderFromList(req.params.id);

    if (!order) {
        return res.status(404).send();
    }

    orders = orders.filter(obj => obj.id !== order.id);
    return buildResponse(res, {}, HttpCode.NO_CONTENT);
};
