import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import app from "../../src/app";
import { User } from "../../src/model/user";

chai.use(chaiHttp);

const expect = chai.expect;

const user: User = {
    email: "me@me.com",
    firstName: "Hugo",
    id: Math.floor(Math.random() * 100) + 1,
    lastName: "Melo",
    password: "password",
    phone: "12345678",
    userStatus: 1,
    username: "hugomelo"
};

describe("userRoute", () => {
    it("should respond with HTTP 404 since there is no user", async () => {
        return chai
            .request(app)
            .get(`/users/${user.username}`)
            .then(res => expect(res.status).to.be.equal(404));
    });
    it("should create a new user and retrieve it back", async () => {
        return chai
            .request(app)
            .post(`/users`)
            .send(user)
            .then(res => {
                expect(res.status).to.be.equal(201);
                expect(res.body.username).to.be.equal(user.username);
            });
    });
});
