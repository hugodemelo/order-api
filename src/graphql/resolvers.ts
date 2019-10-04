import { IResolvers } from "graphql-tools";
import { OrderModel } from "../schemas/order";

export class Resolvers {
    public getResolvers(): IResolvers {
        return {
            Mutation: {
                createOrder: async (root, order) => {
                    const newOrder = new OrderModel(order);
                    return newOrder.save();
                },
                removeOrder: async (root, { id }) => {
                    const order = await OrderModel.findById(id);
                    return await order.remove();
                }
            },
            Query: {
                allOrders: async (root, { filter }) => {
                    const query = filter ? { status: filter } : {};
                    return await OrderModel.find(query);
                },
                getOrder: async (root, { id }) => {
                    return await OrderModel.findById(id);
                }
            }
        };
    }
}
