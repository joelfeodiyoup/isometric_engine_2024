import { BaseProps } from "../app";
import * as styles from "./MenuButton.module.css";

export const MenuButton = (props: BaseProps) => {
  return <a className={styles.menu}>{props.children}</a>;
}