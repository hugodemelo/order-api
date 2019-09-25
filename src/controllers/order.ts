import { NextFunction, Request, Response } from "express";
import { OrderModel } from "../schemas/order";
import { UserModel } from "../schemas/user";
import { buildResponse, HttpCode, LinkBuilder } from "../utils";

export const getOrder = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    OrderModel.findById(orderId, (err, order) => {
        if (!order) {
            return buildResponse(res, {}, HttpCode.NOT_FOUND);
        }
        order = order.toJSON();
        order = new LinkBuilder(order).rel("self").orders().id(order.id).build();
        order = new LinkBuilder(order).rel("user").users().id(order.userId).build();
        return buildResponse(res, order, HttpCode.OK);
    })
};

export const getAllOrders = (req: Request, res: Response, next: NextFunction) => {
    const status = req.query.status;
    const query = status ? { status: status } : { };
    OrderModel.find(query, (err, orders) => {
        return buildResponse(res, orders, HttpCode.OK);
    });
};

export const addOrder = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;

    UserModel.findById(userId, (err, user) => {
        if (!user) {
            return buildResponse(res, {}, HttpCode.NOT_FOUND);
        }

        const newOrder = new OrderModel(req.body);
        newOrder.save((error, order) => {
            order = order.toJSON();
            order = new LinkBuilder(order).rel("self").orders().id(order._id).build();
            order = new LinkBuilder(order).rel("user").users().id(order.userId).build();
            return buildResponse(res, order, HttpCode.CREATED);
        });
    });
};

export const removeOrder = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    OrderModel.findById(orderId, (err, order) => {
        if (!order) {
            return buildResponse(res, {}, HttpCode.NOT_FOUND);
        }
        order.remove(error => buildResponse(res, {}, HttpCode.NO_CONTENT));
    });
};
