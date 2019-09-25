import { Document, Model, model, Schema } from "mongoose";
import { Order, OrderStatus } from "../model/order";

const OrderSchema: Schema = new Schema({
    complete: Boolean,
    quantity: Number,
    shipDate: Date,
    status: { type: String, enum: [OrderStatus.Placed, OrderStatus.Delivered, OrderStatus.Approved] },
    userId: { type: Schema.Types.ObjectId, ref: "User" }
});

interface OrderModel extends Order, Document {}

export const OrderModel: Model<OrderModel> = model("Order", OrderSchema);
