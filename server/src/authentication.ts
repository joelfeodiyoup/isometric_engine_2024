import { randomUUID } from "crypto";

export type UserInterface = {
  name: string,
  id: string,
  roles: Array<"user" | "admin">
  /*
    Might also have:
      - loggedIn: true
      - roles: ['user', 'admin']
      - etc
   */
}

/**
 * key used by users to prove identity
 */
export type AuthenticationKey = {
  name: string, password: string
}

export class Authentication {
  private users: UserInterface[] = [
    {name: "joel", id: '1', roles: []},
    {name: "brian", id: '2', roles: []},
    {name: "jasmine", id: '3', roles: []},
  ];
  constructor() {}


  public getUser(token: string): Promise<UserInterface | null> {
    if (token === "unknown") {
      return Promise.resolve(null);
    } else {
      // 
      return Promise.resolve(this.users.find(user => user.name === token) ?? null);
    }
  }

  public createAccount(user: UserInterface, key: AuthenticationKey) {
    const id = this.users.length + 1;
    this.users.push({...user, id: `${id}`});
    this.authentication.push({...key, id: `${id}`});
  }

/**
   * Used by users when they want to sign in.
   * User provides a name and password, and gets a token in return
   * @param key 
   */
public authenticate(key: AuthenticationKey) {
  const user = this.authentication.find(existingUser => {
    return existingUser.name === key.name && existingUser.password === key.password;
  });
  if (!user) {
    return null;
  }
  const userInterface = this.users.find(x => x.id === user.id)!;
  
  const token = this.getUniqueToken((token: string) => !this.authenticatedUsers.has(token));
  this.authenticatedUsers.set(token, userInterface);
  return token;
}

/**
 * Note that this is obviously just for a demo purpose.
 * In the real world I would use some other service to handle authentication,
 * that makes storage of passwords and everything else secure.
 * An example might be AWS Cognito which I have used in the past https://docs.aws.amazon.com/cognito/
 * 
 * For this demo purpose I'll just have a plain text array of passwords / users
 */
private authentication: (AuthenticationKey & {id: string})[] = [
  {name: "joel", password: "password-joel", id: '1'},
  {name: "brian", password: "password-brian", id: '2'},
  {name: "jasmine", password: "password-jasmine", id: '3'},
];
private authenticatedUsers: Map<string, UserInterface> = new Map();

private getUniqueToken(checkUniqueness: (string) => boolean): string {
  const token = randomUUID();
  if (!checkUniqueness(token)) {
    return this.getUniqueToken(checkUniqueness);
  }
  return token;
}
}
