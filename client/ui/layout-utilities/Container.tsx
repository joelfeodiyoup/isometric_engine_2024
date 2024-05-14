import React from "react"

/**
 * transforms an html element into a react element.
 * fairly shamelessly grabbed from here: https://stackoverflow.com/questions/69185915/how-to-cast-an-htmlelement-to-a-react-element
 * 
 * I need this to throw my canvas thing into the react ui.
 * @param param0 
 * @returns 
 */
export const Container = (props: React.ComponentPropsWithoutRef<"div"> & {child: HTMLElement}) => {
  return <div {...props} ref={ ref => ref?.appendChild(props.child)}></div>
}