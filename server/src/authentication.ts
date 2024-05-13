import { randomUUID } from "crypto";

export type UserInterfaceCreationObject = {
  name: string;
  roles: Array<"user" | "admin">;
};
export type UserInterface = UserInterfaceCreationObject & {
  id: string;
  /*
    Might also have:
      - loggedIn: true
      - roles: ['user', 'admin']
      - etc
   */
};

/**
 * key used by users to prove identity
 */
export type AuthenticationKey = {
  name: string;
  password: string;
};
type AuthenticationToken = string;

export interface IAuthentication {
  getUser(token: string): (UserInterface | null);
  createAccount(
    user: UserInterfaceCreationObject,
    key: AuthenticationKey
  ): void;
  authenticate(key: AuthenticationKey): {
    authenticated: boolean;
    token?: AuthenticationToken;
  };
  logOut(token: AuthenticationToken): boolean;
}

/**
 * Note that in the real world I wouldn't write an authentication class myself.
 */
export class Authentication implements IAuthentication {

  constructor(
    /**
   * This would represent a table in the database that contains data for users.
   * But it wouldn't contain any sensitive stuff like their passwords.
   */
    private users: UserInterface[] = [
      { name: "joel", id: "0", roles: [] },
      { name: "brian", id: "1", roles: [] },
      { name: "jasmine", id: "2", roles: [] },
    ],
    /**
     * Note that this is obviously just for a demo purpose.
     * In the real world I would use some other service to handle authentication,
     * that makes storage of passwords and everything else secure.
     * An example might be AWS Cognito which I have used in the past https://docs.aws.amazon.com/cognito/ 
     */
    private authentication: (AuthenticationKey & { usersTableForeignKey: string })[] = [
      { name: "joel", password: "password-joel", usersTableForeignKey: "0" },
      { name: "brian", password: "password-brian", usersTableForeignKey: "1" },
      { name: "jasmine", password: "password-jasmine", usersTableForeignKey: "2" },
    ]
  ) {}

  /**
   * When users are authenticated, they're given a temporary token.
   * This table links that token to a user.
   */
  private authenticatedUsers: Map<AuthenticationToken, UserInterface> = new Map();

  /**
   * Given an authentication token, return the user it's associated with.
   * This may return null, if that token doesn't match anyone.
   * @param token 
   * @returns 
   */
  public getUser(token: AuthenticationToken): (UserInterface | null) {
    if (token === "unknown") {
      return null;
    } else {
      return this.authenticatedUsers.get(token) ?? null;
      // return Promise.resolve(this.authenticatedUsers.find(user => user.name === token) ?? null);
    }
  }

  /**
   * Create a new user:
   * add a user to the users table
   * add authentication data to the authentication table
   * link those two.
   * @param user 
   * @param key 
   */
  public createAccount(user: UserInterfaceCreationObject, key: AuthenticationKey) {
    const usersForeignKey = this.addUserData(user);
    this.addUserAuthenticationData(key, usersForeignKey);
  }

  /**
   * Adds the non-sensitive data to the users table.
   * returns the key for this user.
   * @param user 
   * @returns 
   */
  private addUserData(user: UserInterfaceCreationObject): string {
    const id = `${this.users.length}`;
    this.users.push({...user, id})
    return id;
  }

  private addUserAuthenticationData(key: AuthenticationKey, usersTableForeignKey: string) {
    this.authentication.push({...key, usersTableForeignKey});
  }

  /**
   * Used by users when they want to sign in.
   * User provides a name and password, and gets a token in return
   * @param key
   */
  public authenticate(key: AuthenticationKey): {
    authenticated: boolean;
    token?: AuthenticationToken;
  } {
    const user = this.authentication.find((existingUser) => {
      return (
        existingUser.name === key.name && existingUser.password === key.password
      );
    });
    if (!user) {
      return { authenticated: false };
    }
    const userInterface = this.users.find((x) => x.id === user.usersTableForeignKey)!;

    const token = this.getUniqueToken(
      (token: string) => !this.authenticatedUsers.has(token)
    );
    this.authenticatedUsers.set(token, userInterface);
    return { authenticated: true, token };
  }

  /**
   * This just removes the association of the user's temporary authentication token with that user.
   * This means that if anyone later tries to use that authentication token, it won't work.
   * To get another token, the user would have to "sign in" again with name/password.
   * @param token 
   * @returns 
   */
  public logOut(token: string) {
    return this.authenticatedUsers.delete(token);
  }

  /**
   * Make a unique token
   * 
   * @param checkUniqueness - function to check that this is unique
   * @returns 
   */
  private getUniqueToken(checkUniqueness: (string) => boolean): string {
    const token = randomUUID();
    if (!checkUniqueness(token)) {
      // some small risk of infinite recursion, I suppose.
      return this.getUniqueToken(checkUniqueness);
    }
    return token;
  }
}
