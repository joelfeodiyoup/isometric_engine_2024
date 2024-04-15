import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { Isometric } from "./isometric";

export class Grid {
  public readonly gridPoints: GridPoint[][];
  public readonly gridCells: GridCell[][];
  private isometric: Isometric;
  constructor(width: number, height: number) {
    this.isometric = new Isometric(undefined, undefined, {rows: width, cols: height} )

    this.gridPoints = Array.from(Array(height), (_, row) => {
      return Array.from(Array(width), (_, col) => {
        const cell = new GridPoint(col, row, this.isometric);
        return cell;
      });
    });

    this.gridCells = this.gridPoints.map(row => {
      return row.reduce((gridCells, gridPoint) => {
        const topLeft = gridPoint;
        const topRight = gridPoint.neighbours(this.gridPoints).east;
        const bottomLeft = gridPoint.neighbours(this.gridPoints).south;
        const bottomRight = bottomLeft?.neighbours(this.gridPoints).east;

        if (!topLeft || !topRight || !bottomLeft || !bottomRight) {
          return gridCells;
        }

        gridCells.push(new GridCell(topLeft, topRight, bottomLeft, bottomRight, gridPoint.x, gridPoint.y));
        return gridCells;
      }, [] as GridCell[])
    })
  }
  
  closestCell(x: number, y: number) {
    // the tricky thing in finding the closest point is that the edges of the cell
    // can be weird shapes due to the heigh differences at the edges

    // first go through each grid cell and just find the ones it could potentially be.
    const withinBoundingCell = this.gridCells.flat().filter(cell => {
      const isWithinBoundingCorners = cell.topLeft.coords.x < x
        && cell.bottomRight.coords.x > x
        && cell.bottomLeft.coords.y > y
        && cell.topRight.coords.y < y;
      return isWithinBoundingCorners;
    });

    // now for each of these, do a more thorough check on the boundaries of the cell
    const isEntirelyWithinCell = withinBoundingCell.find(cell => {
      return cell.isPointInsideCell({x, y});
    });
    return isEntirelyWithinCell;
  }

  closestPoint(x: number, y: number) {
    return this.gridPoints.flat().reduce((closest, point) => {
      const distance = point.distanceToPoint({x, y});
      if (distance < closest.distance) {
        closest = {point, distance};
      }
      return closest;
    }, {point: null, distance: Infinity} as {point: GridPoint | null, distance: number})
  }
}