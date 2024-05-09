import { PropsWithChildren, ReactElement, ReactNode, useState } from "react"

export const DropdownMenu = (props: {children: {top: JSX.Element, children: JSX.Element}}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (<>
    <nav>
      <span className="relative" onClick={() => setIsOpen(!isOpen)}>
        {props.children.top}
      </span>
      {isOpen && <ul className="absolute bg-teal-100">
        <MenuBlock>
          {props.children.children}
        </MenuBlock>  
      </ul>}
    </nav>
  </>)
}

const MenuBlock = (props: {children: ReactElement}) => <div className="bg-teal-100">
  {props.children}
</div>