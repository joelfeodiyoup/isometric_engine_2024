import { ReactElement } from "react";

export const Layout = ({children}: {children: {
  top: ReactElement,
  side: ReactElement,
  gameRender: ReactElement,
  modal: ReactElement
}}) => {
  return (<>
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    }}>
      <header style={{zIndex: 10, background: 'white'}}>
        {children.top}
      </header>
      <section style={{
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        height: '100%',
      }}>
        <div style={{
          flexGrow: 1,
          height: '100%',
        }}>
          {children.gameRender}
        </div>
        {/* {children.modal && <div style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0}}>
          {children.modal}
        </div> } */}
        <aside style={{marginLeft: 'auto', background: 'white'}}>
          {children.side}
        </aside>
      </section>
    </section>
  </>)
}