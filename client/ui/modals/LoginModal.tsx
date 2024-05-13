import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  setUser,
} from "../../state/features/user/userSlice";
import { GET_USER } from "../graphql/User";
import { LOGIN } from "../graphql/Login";
import { closeModal } from "../../state/features/ui/uiSlice";

export const LoginModal = () => {
  const token = useSelector(selectUser).token;
  return (
    <>
      {!token.length && <GetToken />}
      {!!token.length && <GetUser />}
    </>
  );
};

export const GetToken = () => {
  const dispatch = useDispatch();
  const [newUser, setNewUser] = useState<{ name: string; password: string }>({
    name: "joel",
    password: "password-joel",
  });
  const [login, { data, loading, error }] = useMutation(LOGIN);
  const token = data?.login?.token ?? '';

  useEffect(() => {
    dispatch(setUser({ token }));
  }, [token.length])

  if (loading) {
    return <p>awaiting network response for token</p>;
  }

  if (error) {
    return <p>some network error occurred: {JSON.stringify(error)}</p>;
  }

  return (
    <>
      <h2>log in:</h2>
      <label>
        name:
        <input
          type="text"
          onChange={(event) =>
            setNewUser({ ...newUser, name: event.target.value })
          }
          value={newUser.name}
        />
      </label>
      <label>
        password:
        <input
          type="password"
          onChange={(event) =>
            setNewUser({ ...newUser, password: event.target.value })
          }
          value={newUser.password}
        ></input>
      </label>
      <button
        onClick={() =>
          login({
            variables: {
              name: newUser.name,
              password: newUser.password,
            },
          })
        }
      >
        submit
      </button>
    </>
  );
};

/**
 * get the user data, when we get a token
 * @returns 
 */
const GetUser = () => {
  const dispatch = useDispatch();
  const [done, setDone] = useState(false);

  /**
   * using a network-only fetch policy here, as the token is added as a header, and so it appears to be the same query from apollo's pov
   */
  const { loading, error, data } = useQuery(GET_USER, {fetchPolicy: "network-only"});
  const name = data?.user?.name ?? "";
  useEffect(() => {
    dispatch(setUser({name, isLoggedIn: !!name.length}));
    setDone(!!name.length);
    console.log(done);
  }, [name.length])
  
  useEffect(() => {
    if (done) {
      dispatch(closeModal());
    }
  }, [done])

  if (loading) {
    return <pre>loading user</pre>;
  }
  if (error) {
    return <pre>{JSON.stringify(error)}</pre>;
  }
  return <p>loaded the user</p>;
};
