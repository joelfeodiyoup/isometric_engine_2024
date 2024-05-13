import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { BaseProps } from "../app";
import * as styles from "./MenuButton.module.css";

export const MenuButton = (props: BaseProps & {onClick: () => void}) => {
  return <button onClick={props.onClick} className={styles.menu}>{props.children}</button>;
}