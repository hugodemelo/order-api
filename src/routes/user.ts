import { Express } from "express";
import * as UserController from "../controllers/user";

export class UserRoute {
    public routes(app: Express): void {
        app.route("/users").post(UserController.addUser);
        app.route("/users/:username").get(UserController.getUser);
        app.route("/users/:username").patch(UserController.updateUser);
        app.route("/users/:username").delete(UserController.deleteUser);
    }
}
