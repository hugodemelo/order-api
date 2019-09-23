import * as bodyParser from "body-parser";
import * as express from "express";
import { IndexRoute } from "./routes/index";
import { UserRoute } from "./routes/user";

// TODO use dependency injection framework
class App {
    public app: express.Express;
    public indexRoutes: IndexRoute = new IndexRoute();
    public userRoutes: UserRoute = new UserRoute();

    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.indexRoutes.routes(this.app);
        this.userRoutes.routes(this.app);
    }
}

export default new App().app;
