import { ApolloServer } from "apollo-server-express";
import { Express } from "express";
import { Resolvers } from "./resolvers";
import { TypeDefs } from "./typeDefs";

export class GraphQL {
    private apollo: ApolloServer;

    constructor() {
        this.apollo = new ApolloServer({
            resolvers: Resolvers,
            typeDefs: TypeDefs
        });
    }

    public setup(app: Express) {
        this.apollo.applyMiddleware({ app: app });
    }
}
