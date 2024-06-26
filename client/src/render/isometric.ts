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
  private zoomMultiplier = 1;
  public get xStep() {
    return this._xStep * this.zoomMultiplier;
  };
  public get yStep() {
    return this._yStep * this.zoomMultiplier;
  };

  private get c1() {
    /** how far to translate everything horizontally.
     * This is important to make sure that everything fits inside the containing element
     * i.e. start drawing at the very edge, rather than have space, or have negative space (the cells are cut off)
     * 
     * This basically needs to be zero, because it's calculated for the "top left" element (i.e. the one at the very left).
     */
    // const horizontalOffset = 0;
    const horizontalOffset = this.xStep * 2;
    return {a: 2 * this.xStep, b: 2 * this.xStep, c: horizontalOffset};
    // return {a: 2 * this.xStep, b: 2 * this.xStep, c: this.initialPosition.x};
  }
  private get c2() {
    // I'm doing weird stuff rendering an ocean. Everything needs to be pushed odwn a bit more.
    const tempHeightOffset = 200;
    /** How much to offset vertically, so that everything is drawn inside the containing element
     * 
     * This basically needs to be half the height, because it's calculated for the "top left" element, whcih is the one at the left (...)
    */
    const verticalOffset = 
      Math.ceil(this.gridSize.rows / 2) * (this.yStep * 2)
      + (this.yStep * 4) + tempHeightOffset;
    return {a: -1 * this.yStep, b: this.yStep, c: verticalOffset};
  }

  public minDimensions() {
    const len = Math.max(this.gridSize.cols, this.gridSize.rows);
    const width = this.xStep * len * 4;
    // const width = this.xStep * this.gridSize.cols * 4;
    // The height also needs a bit extra for the underground rendered terrain.
    // ... just estimate this for now...
    const underGroundRenderedTerrainHeight = this.yStep * 15;

    // I'm doing some weird stuff with rendering an ocean.
    const tempHeightModifier = 20;
    const height = this.yStep * 2 * len + underGroundRenderedTerrainHeight * tempHeightModifier;
    // const height = this.yStep * 2 * this.gridSize.rows + underGroundRenderedTerrainHeight;
    return {width, height};
  }

  // constructor(private xStep = 14,
  //   private yStep = 10) {}
  constructor(xStep = 10, yStep = 10, private gridSize = {rows: 500, cols: 500}) {
    this.setScale(Math.sqrt(3) * xStep, 2 * yStep);
  }

  private setScale(xStep: number, yStep: number) {
    this._xStep = xStep;
    this._yStep = yStep;
  }

  // /**
  //  * set the camera position so that it's centred on a specified cell.
  //  * @param currentElementPosition - the current screen position of an element.
  //  */
  // public setPosition(currentElementPosition: {x: number, y: number}) {
  //   this.initialPosition = {x: (this.windowDimensions.x / 2) - currentElementPosition.x, y: (this.windowDimensions.y / 2) - currentElementPosition.y};
  // }

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
