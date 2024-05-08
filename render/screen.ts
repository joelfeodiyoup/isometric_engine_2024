import { Coords } from "./isometric";

export class Screen {

  constructor(private screen: Coords = {x: 0, y: 0}) {
  }

  /**
   * translate the overall coordinates of some point to the screen coordinates.
   * e.g. if the entire world was visible, the point might be (70, 50).
   * But if the screen top-left is on (20, 10), then the rendered coordinates would need to get translated by this amount.
   * @param coords 
   */
  screenCoords(coords: Coords): Coords {
    return {x: coords.x - this.screen.x, y: coords.y - this.screen.y};
  }
}