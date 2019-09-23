import * as bodyParser from "body-parser";
import * as express from "express";
import { OrderRoute } from "./routes/order";
import { UserRoute } from "./routes/user";

// TODO use dependency injection framework
class App {
    public app: express.Express;
    public userRoutes: UserRoute = new UserRoute();
    public orderRoutes: OrderRoute = new OrderRoute();

    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.userRoutes.routes(this.app);
        this.orderRoutes.routes(this.app);
    }
}

export default new App().app;
