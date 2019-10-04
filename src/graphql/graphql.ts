import { ApolloServer } from "apollo-server-express";
import { Express } from "express";
import { Resolvers } from "./resolvers";
import { TypeDefs } from "./typeDefs";

export class GraphQL {
    private apollo: ApolloServer;
    private resolvers: Resolvers = new Resolvers();
    private typeDefs: TypeDefs = new TypeDefs();

    constructor() {
        this.apollo = new ApolloServer({
            resolvers: this.resolvers.getResolvers(),
            typeDefs: this.typeDefs.getTypeDefs()
        });
    }

    public setup(app: Express) {
        this.apollo.applyMiddleware({ app: app });
    }
}
