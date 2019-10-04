import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

export class TypeDefs {
    public getTypeDefs(): DocumentNode {
        return gql`
            type Order {
                id: ID!
                userId: String!
                quantity: Int!
                status: String!
                complete: Boolean!
            }

            type Query {
                allOrders(filter: String): [Order]!
                getOrder(id: String!): Order
            }

            type Mutation {
                createOrder(userId: String!, quantity: Int!, status: String!, complete: Boolean!): Order!
                removeOrder(id: String!): Order!
            }
        `;
    }
}
