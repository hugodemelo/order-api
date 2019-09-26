import { Express } from "express";
import * as passport from "passport";
import { PassportConfiguration } from "../config/passport";
import * as OrderController from "../controllers/order";

export class OrderRoute extends PassportConfiguration {
    public routes(app: Express): void {
        app.route("/store/orders").post(passport.authenticate("jwt", { session: false }), OrderController.addOrder);
        app.route("/store/orders").get(passport.authenticate("jwt", { session: false }), OrderController.getAllOrders);
        app.route("/store/orders/:id").get(passport.authenticate("jwt", { session: false }), OrderController.getOrder);
        app.route("/store/orders/:id").delete(passport.authenticate("jwt", { session: false }), OrderController.removeOrder);
    }
}
