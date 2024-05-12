import { useDispatch, useSelector } from "react-redux";
import { logOut, selectUser, setUser } from "../state/features/user/userSlice"
import { useEffect, useState } from "react";
import { LOGIN } from "./graphql/Login";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "./graphql/User";

/**
 * This component indicates whether the user is logged in or not.
 * If the user is not logged in, they could still continue as a guest, but saving functionality wouldn't work.
 * If not logged in, they get some options to do it.
 * If 
 * @returns 
 */
export const AccountStatus = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [newUser, setNewUser] = useState<{name: string, password: string}>({name: '', password: ''});
  const [login, {data, loading, error}] = useMutation(LOGIN);
  useEffect(() => {
    console.log(`dataChanged: ${data?.login?.token}`);
    const token = data?.login?.token as string;
    if (token) {
      // I think I shouldn't do this actually.

      dispatch(setUser({token}))
    }
    // LoadUser();
  }, [data])
  return (<>
    {user.isLoggedIn ?
      <pre>logged in as: {user.name}</pre>
      : <>
        <h2>log in:</h2>
        <label>
        name:
        <input type="text" onChange={(event) => setNewUser({...newUser, name: event.target.value})}></input>
        </label>
        <label>
          password:
          <input type="password" onChange={(event) => setNewUser({...newUser, password: event.target.value})}></input>
        </label>
        <button onClick={() => login({variables: {name: newUser.name, password: newUser.password}})}>submit</button>
        <button onClick={() => console.log(data)}>result?</button>
        </>
    }
    {user.token && <LoadUser />}
    <button onClick={() => dispatch(logOut())}>log out</button>
  </>)
}

/**
 * This is pretty dodgy. Making a new component just to trigger a query.
 * I'm not super familiar with useQuery etc.
 * I didn't use graphql with react previously.
 * I'd figure this out at some time.
 */
const LoadUser = () => {
  const dispatch = useDispatch();
  const {loading, error, data} = useQuery(GET_USER);
  useEffect(() => {
    console.log(`the user loaded! ${data}`);
    dispatch(setUser({name: data?.user?.name, isLoggedIn: true}));
  }, [data])
  return <><p>going to attempt to log in. or have done already!</p></>
}