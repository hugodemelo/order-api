import app from "./app";
import * as https from "https";
import { readFileSync } from "fs";

const PORT = process.env.PORT;

const httpsOptions = {
    key: readFileSync(`${__dirname}/config/key.pem`),
    cert: readFileSync(`${__dirname}/config/cert.pem`)
};

https.createServer(httpsOptions, app).listen(PORT);
