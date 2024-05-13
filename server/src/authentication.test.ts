import { Authentication, AuthenticationKey, UserInterfaceCreationObject } from "./authentication";
import { describe, test, expect, beforeEach } from '@jest/globals';


describe('authentication', () => {
  let authentication: Authentication;
  let user: UserInterfaceCreationObject
  let authenticationKey: AuthenticationKey;
  beforeEach(() => {
    authentication = new Authentication();
    user = {
      name: 'gandalf',
      roles: []
    };
    authenticationKey = {name: 'gandalf', password: 'password'};
  })
  describe('can authenticate a user in the user table', () => {
    let authenticationResult: ReturnType<Authentication["authenticate"]>;
    beforeEach(() => {
      authentication.createAccount(user, authenticationKey);
      authenticationResult = authentication.authenticate(authenticationKey);
    })
    
    test('can authenticate', () => {
      expect(authenticationResult.authenticated).toBeTruthy();
      expect(authenticationResult).toHaveProperty('token');
      expect(authenticationResult?.token?.length).toBeGreaterThanOrEqual(1);
    });

    test('can retrieve the user using the token', () => {
      let retrievedUser = authentication.getUser(authenticationResult.token!);
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.name).toBe('gandalf');
    });

    test('logging out wipes the user', () => {
      authentication.logOut(authenticationResult.token!);
      let retrievedUser = authentication.getUser(authenticationResult.token!);
      expect(retrievedUser).toBeNull();
    });
  });
})