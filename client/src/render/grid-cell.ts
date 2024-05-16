import { store } from "../state/app/store";
import { GridPoint } from "./grid-point";
import { Coords } from "./isometric";

/**
 * Represents a rectangular area of the grid, defined by the points topLeft, topRight, etc.
 * Also contains some methods to check things about this. i.e. "is some point in the cell"
 */
export class GridCell {
  public isFilled = true;
  public color: string | null = "green";

  /**
   * Todo: find some way for each cell to say which image it should render.
   * Possibly it'll reference some other file which contains keys for images.
   * Not sure yet.
   */
  public image: any;

  constructor(
    public readonly topLeft: GridPoint,
    public readonly topRight: GridPoint,
    public readonly bottomLeft: GridPoint,
    public readonly bottomRight: GridPoint,
    public readonly x: number,
    public readonly y: number,
    public drawFill: (cell: GridCell) => void,
    public drawImage: (cell: GridCell) => void,
    public drawBaseCellFill: (cell: GridCell) => void,
  ) {
  }

  public isPointInsideCell(point: Coords): boolean {
    const topLine = this.getLineParameters(this.topLeft, this.topRight);
    const bottomLine = this.getLineParameters(this.bottomLeft, this.bottomRight);
    const leftLine = this.getLineParameters(this.topLeft, this.bottomLeft);
    const rightLine = this.getLineParameters(this.topRight, this.bottomRight);

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

    /**
   * given two points, I need to know the parameters that define the line between those points.
   * e.g. x1 = (x, y), x2 = (x', y') then there's a line between those two points
   * the line is y = ax + b
   * This function returns a and b.
   */
  private getLineParameters(x1: GridPoint, x2: GridPoint): {a: number, b: number} {
    if (x1.coords.x === x2.coords.x) {
      throw new Error("vertical line. I need to handle this with a special case.");
    }
    const a = (x1.coords.y - x2.coords.y) / (x1.coords.x - x2.coords.x);
    const b = x1.coords.y - x1.coords.x * a;
    return {a, b};
  }
}