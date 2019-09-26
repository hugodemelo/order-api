import { NextFunction, Request, Response } from "express";
import { OrderModel } from "../schemas/order";
import { UserModel } from "../schemas/user";
import { buildResponse, HttpCode, LinkBuilder } from "../utils";

export const getOrder = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    OrderModel.findById(orderId, (err, order) => {
        if (!order) {
            return buildResponse(res, HttpCode.NOT_FOUND);
        }
        UserModel.findById(order.userId, (error, user) => {
            if (!user) {
                return buildResponse(res, HttpCode.NOT_FOUND);
            }
            order = order.toJSON();
            order = new LinkBuilder(order).rel("self").orders().id(order._id).build();
            order = new LinkBuilder(order).rel("user").users().id(user.username).build();
            return buildResponse(res, HttpCode.OK, order);
        });
    })
};

export const getAllOrders = (req: Request, res: Response, next: NextFunction) => {
    const status = req.query.status;
    const query = status ? { status: status } : { };
    OrderModel.find(query, (err, orders) => {
        return buildResponse(res, HttpCode.OK, orders);
    });
};

export const addOrder = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;

    UserModel.findById(userId, (err, user) => {
        if (!user) {
            return buildResponse(res, HttpCode.NOT_FOUND);
        }

        const newOrder = new OrderModel(req.body);
        newOrder.save((error, order) => {
            order = order.toJSON();
            order = new LinkBuilder(order).rel("self").orders().id(order._id).build();
            order = new LinkBuilder(order).rel("user").users().id(user.username).build();
            return buildResponse(res, HttpCode.CREATED, order);
        });
    });
};

export const removeOrder = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    OrderModel.findById(orderId, (err, order) => {
        if (!order) {
            return buildResponse(res, HttpCode.NOT_FOUND);
        }
        order.remove(error => buildResponse(res, HttpCode.NO_CONTENT));
    });
};
