import * as bodyParser from "body-parser";
import * as express from "express";
import { Index } from "./routes/index";

class App {
    public app: express.Express;
    public indexRoutes: Index;

    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());

        this.indexRoutes = new Index();
        this.indexRoutes.routes(this.app);
    }
}

export default new App().app;
