import { Grid } from "./grid";

export type Coords = {
  x: number;
  y: number;
};

/**
 * This class represents the grid as an isometric form.
 */
export class Isometric {
  private initialPosition: {x: number, y: number};
  private get c1() {
    return {a: 2 * this.xStep, b: 2 * this.xStep, c: this.initialPosition.x};
  }
  private get c2() {
    return {a: -1 * this.yStep, b: this.yStep, c: this.initialPosition.y};
  }

  // constructor(private xStep = 14,
  //   private yStep = 10) {}
  constructor(private xStep = Math.sqrt(3) * 10, private yStep = 10 * 2, gridSize = {rows: 500, cols: 500}) {
    this.initialPosition = {x: gridSize.cols, y: gridSize.rows * yStep};
  }

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
      x: x * this.c1.a + y * this.c1.b + this.c1.c,
      y: x * this.c2.a + y * this.c2.b + this.c2.c,
    };
  }

  public inverse(x: number, y: number) {
    const yGrid =
      (this.c2.a * (this.c1.c - x) + this.c1.a * (y - this.c2.c)) /
      (this.c1.a * this.c2.b - this.c2.a * this.c1.b);
    const xGrid = (y - this.c2.c - yGrid * this.c2.b) / this.c2.a;
    return {
      y: Math.floor(xGrid),
      x: Math.floor(yGrid),
    };
  }
}
