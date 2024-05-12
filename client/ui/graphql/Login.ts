import { gql } from "@apollo/client"

export const LOGIN = gql`
mutation Mutation($name: String!, $password: String!) {
  login(name: $name, password: $password) {
    token
  }
}
`;