import React, { PropsWithChildren, ReactElement, ReactNode, useState } from "react"
import { BaseProps } from "./app";

export const DropdownMenu = (props: BaseProps & {
  top: JSX.Element,
  subMenu: JSX.Element
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (<>
      <span className="relative" onClick={() => setIsOpen(!isOpen)}>
        {props.top}
        {isOpen && 
        <ul className="bg-teal-100" style={{position: "absolute", width: "max-content"}}>
          {/* <MenuBlock> */}
            {props.subMenu}
          {/* </MenuBlock>   */}
        </ul>}
      </span>
  </>)
}