import { Express } from "express";
import * as passport from "passport";
import { PassportConfiguration } from "../config/passport";
import * as UserController from "../controllers/user";

export class UserRoute extends PassportConfiguration {
    public routes(app: Express): void {
        app.route("/users").post(passport.authenticate("jwt", { session: false }), UserController.addUser);
        app.route("/users/:username").get(passport.authenticate("jwt", { session: false }), UserController.getUser);
        app.route("/users/:username").patch(passport.authenticate("jwt", { session: false }), UserController.updateUser);
        app.route("/users/:username").delete(passport.authenticate("jwt", { session: false }), UserController.deleteUser);
        app.route("/users/login").post(UserController.login);
    }
}
