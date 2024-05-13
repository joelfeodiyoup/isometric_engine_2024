import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Authentication, AuthenticationKey, UserInterface } from "./authentication.js";

const authentication = new Authentication();

const typeDefs = `#graphql
  type User {
    name: String
  }

  type AuthenticationToken {
    token: String
  }

  type Query {
    books: [Book]
    user: User
  }
  type Mutation {
    login(name: String!, password: String!): AuthenticationToken
    logout(token: String!): Boolean!
  }
`;

const resolvers = {
  Query: {
    user: (parent, args, contextValue) => {
      return contextValue.user;
    }
  },
  Mutation: {
    login: async (_, key: AuthenticationKey) => {
      const token = authentication.authenticate(key);
      return {token};
    },
    logout: (_, payload: {token: string}) => {
      const response = authentication.logOut(payload.token);
      return response;
    }
  }
}
// https://www.apollographql.com/docs/apollo-server/security/authentication/


interface MyContext {
  user: UserInterface | null
}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async({ req, res }) => {
    const token = req.headers.authorization || '';
    const user = await authentication.getUser(token);
    // if (!user) {
    //   throw new GraphQLError('User is not authenticated', {
    //     extensions: {
    //       code: 'UNAUTHENTICATED',
    //       http: { status: 401 },
    //     },
    //   });
    // }
    return { user }
  }
})

console.log(`🚀 Server ready at: ${url}`);