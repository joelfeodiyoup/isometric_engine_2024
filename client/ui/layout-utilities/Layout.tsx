import { ReactElement } from "react";

export const Layout = ({children}: {children: {
  top: ReactElement,
  side: ReactElement,
  modal: ReactElement
}}) => {
  return (<>
    <section style={{
      display: 'flex',
      flexDirection: 'column',
    }}>
      <header style={{background: 'white'}}>
        {children.top}
      </header>
      <section style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        {children.modal}
        <aside style={{marginLeft: 'auto', background: 'white'}}>
          {children.side}
        </aside>
      </section>
    </section>
  </>)
}