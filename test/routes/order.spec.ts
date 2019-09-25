import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import app from "../../src/app";
import { OrderStatus } from "../../src/model/order";
import { OrderModel } from "../../src/schemas/order";

chai.use(chaiHttp);

const expect = chai.expect;

const order = {
    complete: false,
    quantity: 1,
    shipDate: new Date(),
    status: OrderStatus.Placed,
    userId: 20
};

let createdOrderId;

describe("orderRoute", () => {
    before(async () => {
        expect(OrderModel.modelName).to.be.equal("Order");
        OrderModel.collection.drop();
    });
    it("should respond with HTTP 404 status because there is no order", async () => {
        return chai
            .request(app)
            .get(`/store/orders/0000`)
            .then(res => expect(res.status).to.be.equal(404));
    });
    it("should create a new user for order tests", async () => {
        const user = {
            email: 'me@me.com',
            firstName: 'Hugo',
            lastName: 'Melo',
            password: 'password',
            phone: '5555555',
            userStatus: 1,
            username: 'hugomelo'
        };
        return chai
            .request(app)
            .post(`/users`)
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
            .then(res => {
                expect(res.status).to.be.equal(200);
                expect(res.body.length).to.be.equal(1);
            });
    });
    it("should return all orders that are PLACED", async () => {
        return chai
            .request(app)
            .get(`/store/orders?status=PLACED`)
            .then(res => {
                expect(res.status).to.be.equal(200);
                expect(res.body.length).to.be.equal(1);
            });
    });
    it("should return no orders that are DELIVERED", async () => {
        return chai
            .request(app)
            .get(`/store/orders?status=DELIVERED`)
            .then(res => {
                expect(res.status).to.be.equal(200);
                expect(res.body.length).to.be.equal(0);
            });
    });
    it("should remove an existing order", async () => {
        return chai
            .request(app)
            .delete(`/store/orders/${createdOrderId}`)
            .then(res => expect(res.status).to.be.equal(204));
    });
    it("should return 404 when trying to remove an order that does not exist", async () => {
        return chai
            .request(app)
            .delete(`/store/orders/${createdOrderId}`)
            .then(res => expect(res.status).to.be.equal(404));
    });
});
