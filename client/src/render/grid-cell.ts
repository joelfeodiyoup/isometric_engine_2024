import value from "perlin-noise";
import { store } from "../state/app/store";
import { Canvas, ImageSource, LoadedImage } from "./canvas";
import { GridPoint } from "./grid-point";
import { Coords } from "./isometric";
import { lineParameters } from "./utils/maths";
import { CellRender } from "./cell-render";
import { Observer } from "./utils/observable";

/**
 * Represents a rectangular area of the grid, defined by the points topLeft, topRight, etc.
 * Also contains some methods to check things about this. i.e. "is some point in the cell"
 */
export class GridCell implements Observer {
  update(point: GridPoint) {
    this.cellRender.recalculate();
  }
  public isFilled = true;
  public avgHeight = 0;
  /**
   * polygons of points to render this cell, including a brightness value.
   */
  public get polygons() {
    return this.cellRender.polygonsForRendering;
  }
  private cellRender: CellRender;

  /**
   * Todo: find some way for each cell to say which image it should render.
   * Possibly it'll reference some other file which contains keys for images.
   * Not sure yet.
   */
  // public image: any;
  public hasImage: boolean = false;
  public imageSource = Canvas.randomTree;

  public get isAboveGround() {
    return this.topLeft.height > 0 && this.topRight.height > 0 && this.bottomRight.height > 0 && this.bottomLeft.height > 0;
  }

  public setImage(src: LoadedImage) {
    this.imageSource = src;
  }

  public get cells(): GridPoint[] {
    return [...[this._topLeft, this._topRight, this._bottomRight, this._bottomLeft]];
  }
  public get rotation(): number {
    return store.getState().gameControls.value.rotation;
  }

  public get topLeft(): GridPoint {
    return this.cells[this.rotation % 4];
  }
  public get topRight(): GridPoint {
    return this.cells[(this.rotation + 1) % 4];
    // return this._topRight;
  }
  public get bottomLeft(): GridPoint {
    return this.cells[(this.rotation + 3) % 4];
    // return this._bottomLeft;
  }
  public get bottomRight(): GridPoint {
    return this.cells[(this.rotation + 2) % 4];
    // return this._bottomRight;
  }

  constructor(
    private _topLeft: GridPoint,
    private _topRight: GridPoint,
    private _bottomLeft: GridPoint,
    private _bottomRight: GridPoint,
    /** the col number for this cell */
    public readonly x: number,
    /** the row number for this cell */
    public readonly y: number,
  ) {
    this.avgHeight = (this.topLeft.height + this.topRight.height + this.bottomRight.height + this.bottomLeft.height) / 4;
    this.cellRender = new CellRender(
      {west: this._topLeft, north: this._topRight, east: this._bottomRight, south: this._bottomLeft}
    );
    [this._bottomLeft, this._bottomRight, this._topLeft, this._topRight].forEach(point => {
      point.attach(this);
    })
  }

  public isPointInsideCell(point: Coords): boolean {
    const topLine = lineParameters(this.topLeft.coords, this.topRight.coords);
    const bottomLine = lineParameters(this.bottomLeft.coords, this.bottomRight.coords);
    const leftLine = lineParameters(this.topLeft.coords, this.bottomLeft.coords);
    const rightLine = lineParameters(this.topRight.coords, this.bottomRight.coords);

    return !this.pointIsAboveLine(point, topLine) &&
      this.pointIsAboveLine(point, bottomLine) &&
      this.pointIsAboveLine(point, leftLine) &&
      !this.pointIsAboveLine(point, rightLine);
  }

    /**
   * given some line and a point, check if the point is above or below the line
   * @param x 
   * @param line 
   */
    private pointIsAboveLine(x: Coords, line: {a: number, b: number}): boolean {
      /**
       * The line has equation y = ax + b, with a and b known.
       * For this point (x, y), substitute in x, to see where y would be, for this x value, if it were on the line.
       * then this y value can be compared with the actual y value of the point.
       */
      const yOnLine = line.a * x.x + line.b;
      const isAboveLine = x.y <= yOnLine;
      return isAboveLine;
    }
}