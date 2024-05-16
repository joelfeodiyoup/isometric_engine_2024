import { appendFile } from "fs";
import { Grid } from "./grid";
import { store } from "../state/app/store";

export type Coords = {
  x: number;
  y: number;
};

/**
 * This class represents the grid as an isometric form.
 */
export class Isometric {
  private _xStep: number = Math.sqrt(3) * 10;
  private _yStep: number = 10 * 2;
  public get xStep() {
    return this._xStep;
  };
  public get yStep() {
    return this._yStep;
  };

  private initialPosition: {x: number, y: number};
  private get c1() {
    return {a: 2 * this.xStep, b: 2 * this.xStep, c: this.initialPosition.x};
  }
  private get c2() {
    return {a: -1 * this.yStep, b: this.yStep, c: this.initialPosition.y};
  }

  // constructor(private xStep = 14,
  //   private yStep = 10) {}
  constructor(xStep = Math.sqrt(3) * 10, yStep = 10 * 2, gridSize = {rows: 500, cols: 500}) {
    this.setScale(xStep, yStep);
    this.initialPosition = {x: gridSize.cols, y: (gridSize.rows + 2) * yStep};
    const app = store.subscribe
  }

  private setScale(xStep: number, yStep: number) {
    this._xStep = xStep;
    this._yStep = yStep;
  }

  zoomIn() {
    this._xStep = this._xStep * 2;
    this._yStep = this._yStep * 2;
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
