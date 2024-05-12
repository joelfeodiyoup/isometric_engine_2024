import { PropsWithChildren, ReactElement } from "react"

export const Cluster = (props: PropsWithChildren) => {
  return (<div style={{display: 'flex', columnGap: '3rem'}}>
    {props.children}
  </div>);
}

export const Stack = (props: PropsWithChildren) => {
  return (<div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>{props.children}</div>);
}