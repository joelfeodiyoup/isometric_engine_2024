import { ReactElement } from "react";
import { DropdownMenu } from "./DropdownMenu";

export const TopNav = () => {
  const navItems = ["file", "options", "help"];
  return (<>
  <section>

    <nav>
      <ul className="flex flex-row justify-between">
        {navItems.map(item => <li>{item}</li>)}
      </ul>
    </nav>
    <DropdownMenu>
      {{
        top: <pre>I am the top</pre>,
        children: <p>blah</p>
      }}
    </DropdownMenu>
      </section>
  </>)
}