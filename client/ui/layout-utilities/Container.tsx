
/**
 * transforms an html element into a react element.
 * fairly shamelessly grabbed from here: https://stackoverflow.com/questions/69185915/how-to-cast-an-htmlelement-to-a-react-element
 * 
 * I need this to throw my canvas thing into the react ui.
 * @param param0 
 * @returns 
 */
export const Container = ({child}: {child: HTMLElement}) => {
  return <div ref={ ref => ref?.appendChild(child)}></div>
}