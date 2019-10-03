import { gql } from "apollo-server-express";

export const TypeDefs = gql`
    type Query {
        setupServer: String
    }
`;
