import { Express, Request, Response } from "express";
import * as UserController from "../controllers/user";

export class UserRoute {
    public routes(app: Express): void {
        app.route(`/users`).post(UserController.addUser);
        app.route(`/users/:username`).get(UserController.getUser);
    }
}
