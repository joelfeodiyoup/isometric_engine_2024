import { store } from "../state/app/store";
import { GridPoint } from "./grid-point";
import { Coords } from "./isometric";
import { lineParameters } from "./utils/maths";

/**
 * Represents a rectangular area of the grid, defined by the points topLeft, topRight, etc.
 * Also contains some methods to check things about this. i.e. "is some point in the cell"
 */
export class GridCell {
  public isFilled = true;
  // public color: string | null = "green";

  /**
   * color is calculated from the angle of the tile
   * This needs to be calculated only when the points change.
   */
  public get color() {
    let brightness = 0;
    brightness += this.brightness(this.bottomLeft.height, this.topLeft.height, 2);
    brightness += this.brightness(this.bottomLeft.height, this.bottomRight.height);
    brightness += this.brightness(this.bottomRight.height, this.topRight.height, 2);
    brightness += this.brightness(this.topLeft.height, this.topRight.height);
    return `hsl(90, ${0.5 * (60 + brightness * 10)}%, ${50 + brightness * 5}%)`;
    // return `hsl(120, ${80 + brightness * 5}%, ${25 + brightness * 5}%)`;
  }

  private brightness(southernHeight: number, northernHeight: number, weighting = 1) {
    return weighting * (southernHeight === northernHeight ? 0
      : southernHeight < northernHeight ? 1 : -1);
  }

  /**
   * Todo: find some way for each cell to say which image it should render.
   * Possibly it'll reference some other file which contains keys for images.
   * Not sure yet.
   */
  // public image: any;
  public hasImage = false;

  public get topLeft(): GridPoint {
    
    return this._topLeft;
  }
  public get topRight(): GridPoint {
    return this._topRight;
  }
  public get bottomLeft(): GridPoint {
    return this._bottomLeft;
  }
  public get bottomRight(): GridPoint {
    return this._bottomRight;
  }

  constructor(
    private _topLeft: GridPoint,
    private _topRight: GridPoint,
    private _bottomLeft: GridPoint,
    private _bottomRight: GridPoint,
    public readonly x: number,
    public readonly y: number,
    public drawFill: (cell: GridCell) => void,
    public drawImage: (cell: GridCell) => void,
    public drawBaseCellFill: (cell: GridCell) => void,
  ) {
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