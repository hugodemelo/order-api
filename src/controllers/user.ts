import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UserModel } from "../schemas/user";
import { buildResponse, HttpCode, LinkBuilder } from "../utils";

export const getUser = (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;
    UserModel.findOne({ username: username }, (err, user) => {
        if (!user) {
            return buildResponse(res, HttpCode.NOT_FOUND);
        }
        user = new LinkBuilder(user.toJSON()).rel("self").users().id(user.username).build();
        return buildResponse(res, HttpCode.OK, user);
    });
};

export const addUser = (req: Request, res: Response, next: NextFunction) => {
    const newUser = new UserModel(req.body);

    newUser.password = bcrypt.hashSync(newUser.password, 10);
    newUser.save((err, user) => {
        user = new LinkBuilder(user.toJSON()).rel("self").users().id(user.username).build();
        return buildResponse(res, HttpCode.CREATED, user);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;

    UserModel.findOne({ username: username }, (err, user) => {
        if (!user) {
            return buildResponse(res, HttpCode.NOT_FOUND);
        }

        const { body } = req;
        user.email = body.email || user.email;
        user.firstName = body.firstName || user.firstName;
        user.lastName = body.lastName || user.lastName;
        user.password = bcrypt.hashSync(body.password || user.password, 10);
        user.phone = body.phone || user.phone;
        user.userStatus = body.userStatus || user.userStatus;
        user.username = body.username || user.username;

        user.save(error => buildResponse(res, HttpCode.NO_CONTENT));
    });
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;
    UserModel.findOne({ username: username }, (err, user) => {
        if (!user) {
            return buildResponse(res, HttpCode.NOT_FOUND);
        }

        user.remove(error => buildResponse(res, HttpCode.NO_CONTENT));
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    UserModel.findOne({ username: username }, (err, user) => {
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return buildResponse(res, HttpCode.UNAUTHORIZED);
        }
        const body = { id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, "my_token");
        return buildResponse(res, HttpCode.OK, { token: token });
    });
};
