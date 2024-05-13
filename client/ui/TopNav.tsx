import { useState } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { AccountStatus } from "./AccountStatus";
import { Cluster } from "./layout-utilities/Cluster";
import { MenuButton } from "./elements/MenuButton";
import { openModal, setModal } from "../state/features/ui/uiSlice";
import { useDispatch } from "react-redux";

export const TopNav = () => {
  const menuOptions = useTopMenuOptions();
  return (<>
    <nav>
      <Cluster>
        {menuOptions.map((item, i) => {
          return <DropdownMenu
            key={`dropdown-menu-${i}`}
            top={<pre>{item.heading}</pre>}
            subMenu={<ul>
              {item.children.map((child, j) => <li key={`topnav-submenuitem-${j}`}>
                <MenuButton onClick={() => child.onClick && child.onClick()}>
                {child.label}
                </MenuButton>
                </li>)}
            </ul>}
          />
        })}
        <AccountStatus />
      </Cluster>
    </nav>
  </>)
}

type MenuOption = {
  heading: string,
  children: {label: string, onClick?: () => void}[]
}

const useTopMenuOptions = () => {
  const dispatch = useDispatch();
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([
    {heading: "File", children: [
      {label: "New Game", onClick: () => {
        dispatch(setModal("saveModal"));
        dispatch(openModal());
      }},
      {label: "Save", onClick: () => {
        dispatch(setModal("saveModal"));
        dispatch(openModal());
      }},
      {label: "Exit"}, 
    ]},
    {heading: "Options", children: [
      {label: "Display Options"},
      {label: "Sound Options"},
      {label: "Speed Options"},
      {label: "Difficulty"},
      {label: "Autosave - On"},
      {label: "Auto Defend - Off"},
      {label: "Messages"},
    ]},
    {heading: "Help", children: [
      {label: "Glossary"},
      {label: "Manual"},
      {label: "Credits"},
    ]},
  ]);
  return menuOptions;
}