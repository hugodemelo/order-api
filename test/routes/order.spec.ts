import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";
import app from "../../src/app";
import { Order, OrderStatus } from "../../src/model/order";

chai.use(chaiHttp);

const expect = chai.expect;

const order: Order = {
    complete: false,
    id: 1,
    quantity: 1,
    shipDate: new Date(),
    status: OrderStatus.Placed,
    userId: 20
};

describe("orderRoute", () => {
    it("should respond with HTTP 404 status because there is no order", async () => {
        return chai
            .request(app)
            .get(`/store/orders/${order.id}`)
            .then(res => expect(res.status).to.be.equal(404));
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
                order.id = res.body.id;
            });
    });
    it("should return the order created on the previous step", async () => {
        return chai
            .request(app)
            .get(`/store/orders/${order.id}`)
            .then(res => {
                expect(res.status).to.be.equal(200);
                expect(res.body.id).to.be.equal(order.id);
                expect(res.body.status).to.be.equal(order.status);
            });
    });
    it("should remove an existing order", async () => {
        return chai
            .request(app)
            .delete(`/store/orders/${order.id}`)
            .then(res => expect(res.status).to.be.equal(204));
    });
    it("should return 404 when trying to remove an order that does not exist", async () => {
        return chai
            .request(app)
            .delete(`/store/orders/${order.id}`)
            .then(res => expect(res.status).to.be.equal(404));
    });
});
