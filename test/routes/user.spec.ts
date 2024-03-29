import * as bcrypt from "bcrypt";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import app from "../../src/app";
import { UserModel } from "../../src/schemas/user";

chai.use(chaiHttp);

const expect = chai.expect;

const user = {
    _id: null,
    email: "me@me.com",
    firstName: "Hugo",
    lastName: "Melo",
    password: "password",
    phone: "12345678",
    userStatus: 1,
    username: "hugomelo"
};

let token = null;

describe("userRoute", () => {
    before((done) => {
        expect(UserModel.modelName).to.be.equal("User");
        UserModel.db.dropCollection("users", (err) => {
            const newUser = new UserModel(user);
            newUser.password = bcrypt.hashSync(user.password, 10);
            newUser.save((error, savedUser) => {
                user._id = savedUser._id;
                done();
            });
        });
    });
    it("should be able to login", async () => {
        return chai
            .request(app)
            .post(`/users/login`)
            .send({ username: user.username, password: user.password })
            .then(res => {
                expect(res.status).to.be.equal(200);
                token = res.body.token;
            });
    });
    it("should respond with HTTP 404 since there is no user", async () => {
        return chai
            .request(app)
            .get(`/users/NO_USER`)
            .set("Authorization", `Bearer ${token}`)
            .then(res => expect(res.status).to.be.equal(404));
    });
    it("should create a new user and retrieve it back", async () => {
        return chai
            .request(app)
            .post(`/users`)
            .set("Authorization", `Bearer ${token}`)
            .send(user)
            .then(res => {
                expect(res.status).to.be.equal(201);
                expect(res.body.username).to.be.equal(user.username);
            });
    });
    it("should return the user created on the previous step", async () => {
        return chai
            .request(app)
            .get(`/users/${user.username}`)
            .set("Authorization", `Bearer ${token}`)
            .then(res => {
                expect(res.status).to.be.equal(200);
                expect(res.body.username).to.be.equal(user.username);
            });
    });
    it("should update the user John", async () => {
        user.email = "john@doe.com";
        user.firstName = "John";
        user.lastName = "Doe";
        user.password = "printer";
        user.phone = "87654321";
        user.userStatus = 10;
        user.username = "johndoe";

        return chai
            .request(app)
            .patch(`/users/hugomelo`)
            .set("Authorization", `Bearer ${token}`)
            .send(user)
            .then(res => expect(res.status).to.be.equal(204));
    });
    it("should return the updated user on the previous step", async () => {
        return chai
            .request(app)
            .get(`/users/${user.username}`)
            .set("Authorization", `Bearer ${token}`)
            .then(res => {
                expect(res.status).to.be.equal(200);
                expect(res.body.email).to.be.equal(user.email);
                expect(res.body.firstName).to.be.equal(user.firstName);
                expect(res.body.lastName).to.be.equal(user.lastName);
                expect(bcrypt.compareSync(user.password, res.body.password)).to.be.equal(true);
                expect(res.body.phone).to.be.equal(user.phone);
                expect(res.body.userStatus).to.be.equal(user.userStatus);
                expect(res.body.username).to.be.equal(user.username);
            });
    });
    it("should delete an existing user", async () => {
        return chai
            .request(app)
            .delete(`/users/${user.username}`)
            .set("Authorization", `Bearer ${token}`)
            .then(res => expect(res.status).to.be.equal(204));
    });
    it("should return 404 when trying to delete an user that does not exist", async () => {
        return chai
            .request(app)
            .delete(`/users/NO_USER`)
            .set("Authorization", `Bearer ${token}`)
            .then(res => expect(res.status).to.be.equal(404));
    });
});
