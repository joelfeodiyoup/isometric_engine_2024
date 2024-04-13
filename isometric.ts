import { Grid } from "./grid";

export type Coords = {
  x: number;
  y: number;
};

/**
 * This class represents the grid as an isometric form.
 */
export class Isometric {
  private get c1() {
    return [2 * this.xStep, 2 * this.xStep, 0];
  }
  private get c2() {
    return [-1 * this.yStep, this.yStep, 0];
  }

  // constructor(private xStep = 14,
  //   private yStep = 10) {}
  constructor(private xStep = Math.sqrt(3) * 10, private yStep = 10 * 2) {}

  /**
   * return screen coordinates for any x/y grid pair
   * @param x
   * @param y
   * @returns
   */
  public coords(x: number, y: number): Coords {
    /**
     * This comes from so me linear algebra.
     * Basically map grid coordinates to isometric coordinates, make some linear equations, and then solve them
     */
    return {
      x: x * this.c1[0] + y * this.c1[1] + this.c1[2],
      y: x * this.c2[0] + y * this.c2[1] + this.c2[2],
    };
  }

  public inverse(x: number, y: number) {
    const yGrid =
      (this.c2[0] * (this.c1[2] - x) + this.c1[0] * (y - this.c2[2])) /
      (this.c1[0] * this.c2[1] - this.c2[0] * this.c1[1]);
    const xGrid = (y - this.c2[2] - yGrid * this.c2[1]) / this.c2[0];
    return {
      y: Math.floor(xGrid),
      x: Math.floor(yGrid),
    };
  }
}
