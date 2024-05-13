import { useDispatch, useSelector } from "react-redux";
import { logOut, selectUser, setUser } from "../state/features/user/userSlice"
import { useEffect, useState } from "react";
import { LOGIN, LOGOUT } from "./graphql/Login";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "./graphql/User";
import { openModal, setModal } from "../state/features/ui/uiSlice";

export const AccountStatus = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const handleOpenLogin = () => {
    dispatch(setModal("logIn"));
    dispatch(openModal());
  }
  if (user.isLoggedIn) {
    return <>
      <span>Logged in as {user.name}</span>
      <Logout />
    </>;
  } else {
    return <button onClick={handleOpenLogin}>Log in</button>;
  }
}

const Logout = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectUser).token;
  const [logoutServer, {data, loading, error}] = useMutation(LOGOUT);
  return <button onClick={() => {
    dispatch(logOut());
    logoutServer({variables: {token}});
  }}>Log out</button>;
}