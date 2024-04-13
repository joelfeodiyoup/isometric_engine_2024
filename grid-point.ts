import { Grid } from "./grid";
import { Coords, Isometric } from "./isometric";

/**
 * Represents a point on the map.
 * Each point has a single height.
 * Four points would make a cell, which will be represented by another object
 */
export class GridPoint {
  public readonly baseCoords: Coords;
  public readonly coords: Coords;
  public isFilled = false;
  protected height: number = 0;
  constructor(public x: number, public y: number,
    private isometric: Isometric) {
    this.baseCoords = this.isometric.coords(x, y);
    this.height = Math.floor(Math.random() * 2 - 2);
    if (x === 0 && y === 0) {
      this.height = 0;
    }
    this.coords = {x: this.baseCoords.x, y: this.baseCoords.y + this.height * -15};
  }
  public neighbours(grid: GridPoint[][]) {
    return {
      north: grid[this.y - 1]?.[this.x] ?? null,
      east: grid[this.y]?.[this.x + 1] ?? null,
      south: grid[this.y + 1]?.[this.x] ?? null,
      west: grid[this.y]?.[this.x - 1] ?? null,
    }
  }

  /**
   * When updating coordinatings, I might want to have a side-effect, to update the bounding box for these coordinates
   * @param newCoords 
   */
  private updateCoords(newCoords: Coords) {

  }

  public increaseHeight() {
    this.height -= 1;
    this.coords.y = this.baseCoords.y + this.height * 15;
    console.log(this);
  }

  public hasFourNeighbours(grid: GridPoint[][]): {topLeft: GridPoint, topRight: GridPoint, bottomLeft: GridPoint, bottomRight: GridPoint} | null {
    const topLeft = this;
    const topRight = this.neighbours(grid).east;
    const bottomLeft = this.neighbours(grid).south;
    const bottomRight = bottomLeft?.neighbours(grid).east ?? null;

    if (!topLeft || !topRight || !bottomLeft || !bottomRight) {
      return null;
    }
    const result = {
      topLeft, topRight, bottomLeft, bottomRight
    };
    return result;
  }
  private neighbourCoords(grid: GridPoint[][], boundingGridPoints: {topLeft: GridPoint, topRight: GridPoint, bottomLeft: GridPoint, bottomRight: GridPoint}): {topLeft: Coords, topRight: Coords, bottomLeft: Coords, bottomRight: Coords} {
    return {
      topLeft: boundingGridPoints.topLeft.coords,
      topRight: boundingGridPoints.topRight.coords,
      bottomLeft: boundingGridPoints.bottomLeft.coords,
      bottomRight: boundingGridPoints.bottomRight.coords,
    };
  }
  public isPointInsideCell(point: Coords, grid: GridPoint[][]) {
    const boundingGridPoints = this.hasFourNeighbours(grid);
    if (!boundingGridPoints) {
      // this is some special case where we don't have four points. It would be an edge piece
      return;
    }
    const points = this.neighbourCoords(grid, boundingGridPoints);

    const topLine = this.getLineParameters(points.topLeft, points.topRight);
    const bottomLine = this.getLineParameters(points.bottomLeft, points.bottomRight);
    const leftLine = this.getLineParameters(points.topLeft, points.bottomLeft);
    const rightLine = this.getLineParameters(points.topRight, points.bottomRight);

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
  private getLineParameters(x1: Coords, x2: Coords): {a: number, b: number} {
    if (x1.x === x2.x) {
      throw new Error("vertical line. I need to handle this with a special case.");
    }
    const a = (x1.y - x2.y) / (x1.x - x2.x);
    const b = x1.y - x1.x * a;
    return {a, b};
  }
}