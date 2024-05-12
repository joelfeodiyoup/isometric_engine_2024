import { ReactElement, useState } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { AccountStatus } from "./AccountStatus";
import { Cluster } from "./layout-utilities/Cluster";
import { MenuButton } from "./elements/MenuButton";

export const TopNav = () => {
  const menuOptions = useTopMenuOptions();
  return (<>
  <section>

    {/* <AccountStatus /> */}
    <nav>
      <Cluster>
        {menuOptions.map((item, i) => {
          return <DropdownMenu
            id={`dropdown-menu-${i}`}
            top={<pre>{item.heading}</pre>}
            subMenu={<ul>
              {item.children.map(child => <li>
                <MenuButton>
                {child.label}
                </MenuButton>
                </li>)}
            </ul>}
          />
        })}
      </Cluster>
    </nav>
      </section>
  </>)
}

type MenuOption = {
  heading: string,
  children: {label: string}[]
}

const useTopMenuOptions = () => {
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([
    {heading: "File", children: [
      {label: "New Game"},
      {label: "Save"},
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