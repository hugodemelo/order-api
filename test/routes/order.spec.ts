import * as bcrypt from "bcrypt";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import app from "../../src/app";
import { OrderStatus } from "../../src/model/order";
import { OrderModel } from "../../src/schemas/order";
import { UserModel } from "../../src/schemas/user";

chai.use(chaiHttp);

const expect = chai.expect;

const order = {
    complete: false,
    quantity: 1,
    shipDate: new Date(),
    status: OrderStatus.Placed,
    userId: 20
};

let createdOrderId = null;
let token = null;

describe("orderRoute", () => {
    before((done) => {
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

        expect(OrderModel.modelName).to.be.equal("Order");
        OrderModel.db.dropCollection("orders", () => {
            UserModel.db.dropCollection("users", () => {
                const newUser = new UserModel(user);
                newUser.password = bcrypt.hashSync(user.password, 10);
                newUser.save((error, savedUser) => {
                    user._id = savedUser._id;
                    done();
                });
            });
        });
    });
    it("should be able to login and get the token to be used on orders requests", async () => {
        return chai
            .request(app)
            .post(`/users/login`)
            .send({ username: "hugomelo", password: "password" })
            .then(res => {
                expect(res.status).to.be.equal(200);
                token = res.body.token;
            });
    });
    it("should respond with HTTP 404 status because there is no order", async () => {
        return chai
            .request(app)
            .get(`/store/orders/0000`)
            .set("Authorization", `Bearer ${token}`)
            .then(res => expect(res.status).to.be.equal(404));
    });
    it("should create a new user for order tests", async () => {
        const user = {
            email: "me@me.com",
            firstName: "Hugo",
            lastName: "Melo",
            password: "password",
            phone: "5555555",
            userStatus: 1,
            username: "hugomelo"
        };
        return chai
            .request(app)
            .post(`/users`)
            .set("Authorization", `Bearer ${token}`)
            .send(user)
            .then(res => {
                expect(res.status).to.be.equal(201);
                expect(res.body.username).to.be.equal(user.username);
                order.userId = res.body._id;
            });
    });
    it("should create a new order and return it", async () => {
        return chai
            .request(app)
            .post(`/store/orders`)
            .set("Authorization", `Bearer ${token}`)
            .send(order)
            .then(res => {
                expect(res.status).to.be.equal(201);
                expect(res.body.userId).to.be.equal(order.userId);
                expect(res.body.complete).to.be.equal(false);
                createdOrderId = res.body._id;
            });
    });
    it("should return the order created on the previous step", async () => {
        return chai
            .request(app)
            .get(`/store/orders/${createdOrderId}`)
            .set("Authorization", `Bearer ${token}`)
            .then(res => {
                expect(res.status).to.be.equal(200);
                expect(res.body._id).to.be.equal(createdOrderId);
                expect(res.body.status).to.be.equal(order.status);
            });
    });
    it("should return all orders so far", async () => {
        return chai
            .request(app)
            .get(`/store/orders`)
            .set("Authorization", `Bearer ${token}`)
            .then(res => {
                expect(res.status).to.be.equal(200);
                expect(res.body.length).to.be.equal(1);
            });
    });
    it("should return all orders that are PLACED", async () => {
        return chai
            .request(app)
            .get(`/store/orders?status=PLACED`)
            .set("Authorization", `Bearer ${token}`)
            .then(res => {
                expect(res.status).to.be.equal(200);
                expect(res.body.length).to.be.equal(1);
            });
    });
    it("should return no orders that are DELIVERED", async () => {
        return chai
            .request(app)
            .get(`/store/orders?status=DELIVERED`)
            .set("Authorization", `Bearer ${token}`)
            .then(res => {
                expect(res.status).to.be.equal(200);
                expect(res.body.length).to.be.equal(0);
            });
    });
    it("should remove an existing order", async () => {
        return chai
            .request(app)
            .delete(`/store/orders/${createdOrderId}`)
            .set("Authorization", `Bearer ${token}`)
            .then(res => expect(res.status).to.be.equal(204));
    });
    it("should return 404 when trying to remove an order that does not exist", async () => {
        return chai
            .request(app)
            .delete(`/store/orders/${createdOrderId}`)
            .set("Authorization", `Bearer ${token}`)
            .then(res => expect(res.status).to.be.equal(404));
    });
});
