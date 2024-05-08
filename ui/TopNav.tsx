export const TopNav = () => {
  const navItems = ["file", "options", "help"];
  return (<>
    <nav>
      <ul>
        {navItems.map(item => <li>{item}</li>)}
      </ul>
    </nav>
  </>)
}