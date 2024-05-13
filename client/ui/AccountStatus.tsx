import { useDispatch, useSelector } from "react-redux";
import { logOut, selectUser, setUser } from "../state/features/user/userSlice"
import React, { useEffect, useState } from "react";
import { LOGIN, LOGOUT } from "./graphql/Authentication";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER } from "./graphql/User";
import { openModal, setModal } from "../state/features/ui/uiSlice";
import { TopMenuButton } from "./elements/Buttons";
import { Cluster } from "./layout-utilities/Cluster";

export const AccountStatus = (props: React.ComponentPropsWithoutRef<"span">) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const handleOpenLogin = () => {
    dispatch(setModal("logIn"));
    dispatch(openModal());
  }
  if (user.isLoggedIn) {
    return <span {...props}>
      <Cluster>
        <span>Logged in as {user.name}</span>
        <Logout />
      </Cluster>
    </span>;
  } else {
    return <span {...props}>
      <TopMenuButton onClick={handleOpenLogin}>Log in</TopMenuButton>
      </span>
  }
}

const Logout = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectUser).token;
  const [logoutServer, {data, loading, error}] = useMutation(LOGOUT);
  return <TopMenuButton onClick={() => {
    dispatch(logOut());
    logoutServer({variables: {token}});
  }}>Log out</TopMenuButton>;
}