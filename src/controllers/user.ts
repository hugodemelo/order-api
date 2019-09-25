import { NextFunction, Request, Response } from "express";
import { UserModel } from "../schemas/user";
import { buildResponse, HttpCode, LinkBuilder } from "../utils";

export const getUser = (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;
    UserModel.findOne({ username: username }, (err, user) => {
        if (!user) {
            return buildResponse(res, {}, HttpCode.NOT_FOUND);
        }
        user = new LinkBuilder(user.toJSON()).rel("self").users().id(user.username).build();
        return buildResponse(res, user, HttpCode.OK);
    });
};

export const addUser = (req: Request, res: Response, next: NextFunction) => {
    const newUser = new UserModel(req.body);
    newUser.save((err, user) => {
        user = new LinkBuilder(user.toJSON()).rel("self").users().id(user.username).build();
        return buildResponse(res, user, HttpCode.CREATED);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;

    UserModel.findOne({ username: username }, (err, user) => {
        if (!user) {
            return buildResponse(res, {}, HttpCode.NOT_FOUND);
        }

        const { body } = req;
        user.email = body.email || user.email;
        user.firstName = body.firstName || user.firstName;
        user.lastName = body.lastName || user.lastName;
        user.password = body.password || user.password;
        user.phone = body.phone || user.phone;
        user.userStatus = body.userStatus || user.userStatus;
        user.username = body.username || user.username;

        user.save(error => buildResponse(res, {}, HttpCode.NO_CONTENT));
    });
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;
    UserModel.findOne({ username: username }, (err, user) => {
        if (!user) {
            return buildResponse(res, {}, HttpCode.NOT_FOUND);
        }

        user.remove(error => buildResponse(res, {}, HttpCode.NO_CONTENT));
    });
};
