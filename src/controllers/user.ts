import { NextFunction, Request, Response } from "express";
import { User } from "../model/user";

let users: Array<User> = [];

const getUserFromList = (username: string): User => users.find(obj => obj.username === username);

export const getUser = (req: Request, res: Response, next: NextFunction) => {
    const user = getUserFromList(req.params.username);
    
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

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const user = getUserFromList(req.params.username);

    if (!user) {
        return res.status(404).send();
    }

    const { body } = req;
    user.email = body.email || user.email;
    user.firstName = body.firstName || user.firstName;
    user.lastName = body.lastName || user.lastName;
    user.password = body.password || user.password;
    user.phone = body.phone || user.phone;
    user.userStatus = body.userStatus || user.userStatus;
    user.username = body.username || user.username;

    return res.status(204).send();
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const user = getUserFromList(req.params.username);

    if (!user) {
        return res.status(404).send();
    }

    users = users.filter(obj => obj.username !== user.username);
    return res.status(204).send();
};
