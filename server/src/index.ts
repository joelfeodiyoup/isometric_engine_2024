import { Authentication } from "./authentication.js";
import { DB } from "./database.js";
import { setupGraphQLServer } from "./graphql.js";

/**
 * Going to remove this for now. I think there's a file system issue when running this
 * in Node inside WSL. Better option is probably to run it inside Docker with an existing image.
 */
// const db = new DB();
const authentication = new Authentication();
setupGraphQLServer(authentication);