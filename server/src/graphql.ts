import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { AuthenticationKey, IAuthentication, UserInterface } from "@src/authentication.js";


interface MyContext {
  user: UserInterface | null
}

export const setupGraphQLServer = async (authenticationService: IAuthentication) => {
  const typeDefs = `#graphql
  type User {
    name: String
  }

  type AuthenticationToken {
    token: String,
    authenticated: Boolean
  }

  type Query {
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
      const authorizationResult = authenticationService.authenticate(key);
      return authorizationResult;
    },
    logout: (_, payload: {token: string}) => {
      const response = authenticationService.logOut(payload.token);
      return response;
    }
  }
}
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
  })
  // https://www.apollographql.com/docs/apollo-server/security/authentication/
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async({ req, res }) => {
      const token = req.headers.authorization || '';
      const user = await authenticationService.getUser(token);
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
}


