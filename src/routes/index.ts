import { Express, NextFunction, Request, Response } from "express";

export class IndexRoute {
    public routes(app: Express): void {
        app.route("/index").get((req: Request, res: Response, next: NextFunction) =>
            res.status(200).send({ status: "success" })
        );
    }
}
