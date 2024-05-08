import { Game } from "./game";

type Colors = {
  gridLine: string,
}

/**
 * Some way to create a "game" that abstracts out all the implementation stuff and just provides the game specific stuff
 * e.g. which images can get rendered, size of screen, etc.
 */
const game = new Game({
  dimensions: {width: 20, height: 30},
  
})