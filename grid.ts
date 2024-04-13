import { GridPoint } from "./grid-point";
import { Isometric } from "./isometric";

export class Grid {
  public readonly grid: GridPoint[][];
  private isometric: Isometric;
  constructor(width: number, height: number) {
    this.isometric = new Isometric()
    this.grid = Array.from(Array(height), (_, row) => {
      return Array.from(Array(width), (_, col) => {
        const cell = new GridPoint(col, row, this.isometric);
        return cell;
      });
    });
  }

  private closestViaIntersection(x: number, y: number, grid: GridPoint[][]) {
    const possibleClosest = this.grid.flat().filter(cel => {
      const neighbours = cel.hasFourNeighbours(grid);
      if (!neighbours) {
        return false;
      }
      const isWithinBoundingCorners = neighbours.topLeft.coords.x < x
        && neighbours.bottomRight.coords.x > x
        && neighbours.bottomLeft.coords.y > y // y counts from top of screen. Value increases as we go down the screen
        && neighbours.topRight.coords.y < y;
      return isWithinBoundingCorners;
    });
    const found = possibleClosest.filter(cell => {
      return cell.isPointInsideCell({x, y}, grid);
    });
    return found[0];
  }

  closestPoint(x: number, y: number) {
    return this.closestViaIntersection(x, y, this.grid);
    // const closest = this.grid.find(row => {
    //   const c = row.find(cel => {
    //     return x > cel.coords.x && y > cel.coords.y
    //   });
    //   return c;
    // });

    // const c = this.grid.reduce((closest, row) => {
      
    // }, null as null | GridPoint)
    // const closest = this.isometric.inverse(x, y);
    // return closest;
  }
}