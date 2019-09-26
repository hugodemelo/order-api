import { readFileSync } from "fs";
import * as https from "https";
import app from "./app";

const PORT = process.env.PORT;

const httpsOptions = {
    cert: readFileSync(`${__dirname}/config/cert.pem`),
    key: readFileSync(`${__dirname}/config/key.pem`)
};

https.createServer(httpsOptions, app).listen(PORT);
