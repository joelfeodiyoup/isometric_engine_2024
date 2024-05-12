import { ReactElement } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { AccountStatus } from "./AccountStatus";

export const TopNav = () => {
  const navItems = ["file", "options", "help"];
  return (<>
  <section>

    <nav>
      <ul className="flex flex-row justify-between">
        {navItems.map(item => <li>{item}</li>)}
      </ul>
    </nav>
    <AccountStatus />
    <DropdownMenu>
      {{
        top: <pre>I am the top</pre>,
        children: <p>blah</p>
      }}
    </DropdownMenu>
      </section>
  </>)
}