import { useDispatch, useSelector } from "react-redux";
import { logOut, selectUser } from "../state/features/user/userSlice"
import React from "react";
import { LOGOUT } from "./graphql/Authentication";
import { useMutation } from "@apollo/client";
import { openModal, setModal } from "../state/features/ui/uiSlice";
import { TopMenuButton } from "./elements/Buttons";
import { Cluster } from "./layout-utilities/layout-partials";

/**
 * This component handles display of the account status.
 * When not signed it, it would allow a user to sign in (through opening a modal)
 * When signed in, it would show that, and allow someone to sign out if they want.
 * @param props 
 * @returns 
 */
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