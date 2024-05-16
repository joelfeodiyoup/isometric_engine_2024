import { ApolloClient, InMemoryCache, NormalizedCacheObject, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { store } from "../../state/app/store";

/**
 * Singleton class for getting a graphql client.
 * Call via the static method: GraphqlClient.getClient()
 */
export class GraphqlClient {
  private static graphQLClientInstance: GraphqlClient;
  private client: ApolloClient<NormalizedCacheObject>
  constructor() {
    const httpLink = createHttpLink({
      uri: "http://localhost:4000",
    });
    const authLink = setContext((_, { headers }) => {
      const authorization = store.getState().user.value.token;
      return {
        headers: {
          ...headers,
          authorization,
        },
      };
    });
    this.client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }

  public static getClient() {
    if (!GraphqlClient.graphQLClientInstance) {
      GraphqlClient.graphQLClientInstance = new GraphqlClient();
    }
    return GraphqlClient.graphQLClientInstance.client;
  }
}