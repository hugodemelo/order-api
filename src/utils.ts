import { Response } from "express";
import * as halson from "halson";

export enum ApplicationType {
    JSON = "application/json"
}

export const enum HttpCode {
    OK = "200",
    CREATED = "201",
    NO_CONTENT = "204",
    BAD_REQUEST = "400",
    UNAUTHORIZED = "401",
    FORBIDDEN = "403",
    NOT_FOUND = "404",
    NOT_ACCEPTABLE = "406",
    INTERNAL_SERVER_ERROR = "500"
}

export const buildResponse = (
    res: Response,
    data: any,
    statusCode: HttpCode,
    applicationType: ApplicationType = ApplicationType.JSON
): Response => {
    return res.format({
        json: () => {
            res.type(applicationType);
            res.status(Number(statusCode)).send(data);
        },
        default: () => {
            res.status(Number(HttpCode.NOT_ACCEPTABLE)).send();
        }
    });
};

export class LinkBuilder<T> {
    private uri: string = "";
    private related: string = "";

    constructor(private readonly entity: T) {}

    orders(): this {
        this.uri = this.uri.concat("/store/orders");
        return this;
    }

    users(): this {
        this.uri = this.uri.concat("/users");
        return this;
    }

    id(id: string | number): this {
        this.uri = this.uri.concat(`/${id}`);
        return this;
    }

    rel(rel: string): this {
        this.related = rel;
        return this;
    }

    build(): T {
        return halson(this.entity).addLink(this.related, this.uri);
    }
}
