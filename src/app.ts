import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import { GraphQL } from "./graphql/graphql";
import { OrderRoute } from "./routes/order";
import { UserRoute } from "./routes/user";

class App {
    public app: express.Express;
    private userRoutes: UserRoute = new UserRoute();
    private orderRoutes: OrderRoute = new OrderRoute();
    private graphQL: GraphQL = new GraphQL();
    private mongoUrl: string = "mongodb://localhost/shop";

    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.userRoutes.routes(this.app);
        this.orderRoutes.routes(this.app);
        this.graphQL.setup(this.app);
        this.setupMongo();
    }

    private setupMongo() {
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    }
}

export default new App().app;
