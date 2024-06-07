import { useState } from "react";
import { DropdownMenu } from "../layout-utilities/DropdownMenu";
import { AccountStatus } from "../AccountStatus";
import { Cluster } from "../layout-utilities/layout-partials";
import { openModal, setModal } from "../../state/features/ui/uiSlice";
import { useDispatch } from "react-redux";
import { MenuButton, TopMenuButton } from "../elements/Buttons";

/**
 * The top panel in the game ui
 * @returns 
 */
export const TopNav = () => {
  const menuOptions = useTopMenuOptions();
  return (<>
    <nav>
      <Cluster>
        {menuOptions.map((item, i) => {
          return <DropdownMenu
            key={`dropdown-menu-${i}`}
            top={<TopMenuButton>{item.heading}</TopMenuButton>}
            subMenu={<ul>
              {item.children.map((child, j) => <li key={`topnav-submenuitem-${j}`}>
                <MenuButton onClick={() => child.onClick?.()}>{child.label}</MenuButton>
                </li>)}
            </ul>}
          />
        })}
        <AccountStatus style={{marginLeft: 'auto'}} />
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
  const handleOpenModal = (...modal: Parameters<typeof setModal>) => {
    dispatch(setModal(modal[0]));
    dispatch(openModal());
  }
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([
    {heading: "File", children: [
      {label: "New Game", onClick: () => {
        handleOpenModal("newGame");
      }},
      {label: "Save", onClick: () => {
        handleOpenModal("saveModal")
      }},
      {label: "Exit"}, 
    ]},
    {heading: "Options", children: [
      {label: "Display Options", onClick: () => {
        handleOpenModal("advisors")
      }},
      {label: "Sound Options", onClick: () => {
        handleOpenModal("finances")
      }},
      {label: "Speed Options"},
      {label: "Difficulty"},
      {label: "Autosave - On"},
      {label: "Auto Defend - Off"},
      {label: "Messages"},
    ]},
    {heading: "Help", children: [
      {label: "Glossary"},
      {label: "Manual"},
      {label: "About", onClick: () => {
        handleOpenModal("about");
      }},
    ]},
  ]);
  return menuOptions;
}