import { Express } from "express";
import * as OrderController from "../controllers/order";

export class OrderRoute {
    public routes(app: Express): void {
        app.route("/store/orders").post(OrderController.addOrder);
        app.route("/store/orders").get(OrderController.getAllOrders);
        app.route("/store/orders/:id").get(OrderController.getOrder);
        app.route("/store/orders/:id").delete(OrderController.removeOrder);
    }
}
