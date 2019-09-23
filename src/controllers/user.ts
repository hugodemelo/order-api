import { NextFunction, Request, Response } from "express";
import { User } from "../model/user";

const users: Array<User> = [];

export const getUser = (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;
    const user = users.find(obj => obj.username === username);
    const httpCode = user ? 200 : 404;
    return res.status(httpCode).send(user);
};

export const addUser = (req: Request, res: Response, next: NextFunction) => {
    const user = {
        email: req.body.email,
        firstName: req.body.firstName,
        id: Math.floor(Math.random() * 100) + 1,
        lastName: req.body.lastName,
        password: req.body.password,
        phone: req.body.phone,
        userStatus: 1,
        username: req.body.username
    };
    users.push(user);
    return res.status(201).send(user);
};
