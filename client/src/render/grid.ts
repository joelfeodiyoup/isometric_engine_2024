import { store } from "../state/app/store";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { Coords, Isometric } from "./isometric";
import { generateGrid } from "./utils/perlin-noise";

export class Grid {
  public readonly gridPoints: GridPoint[][];
  public readonly gridCells: GridCell[][];

  /**
   * This should return the cells in the order in which they should be drawn
   * E.g. this should draw from the top of the screen first.
   * But that order may change, according to rotation of the map.
   */
  public get gridRotated(): GridCell[][] {
    return this.rotateGrid(this.gridCells);
  }

  /**
   * Rotate a grid
   * ... not sure how performant this is.
   * @param grid 
   */
  public rotateGrid<T extends GridCell | GridPoint>(grid: T[][]) {
    const rotation = store.getState().gameControls.value.rotation;
    const remainder = rotation % 4;
    const reverseRows = remainder === 1 || remainder === 2;
    const reverseCols = remainder === 0 || remainder === 1;
    
    const order = (reverseRows
      ? [...grid].reverse()
      : grid
    ).map(row => {
      return reverseCols
        ? [...row].reverse()
        : row
    });
    return order;
  }
  
  public get gridCellDrawOrder(): GridCell[] {
    return this.gridRotated.flat();
  }
  public isometric: Isometric;
  constructor(
    width: number, height: number,
    windowDimensions: {x: number, y: number}
  ) {
    this.isometric = new Isometric(undefined, undefined, {rows: width, cols: height}, windowDimensions )

    // this gets returned as a one dimensional array, of length width * height
    // i.e. it's a flattened 2 dimensional array.
    const grid = generateGrid(width, height);

    this.gridPoints = Array.from(Array(height), (_, row) => {
      return Array.from(Array(width), (_, col) => {
        // grid is a flattened grid. So, reconstruct what the index should be for this row and col.
        const heightGridIndex = row * width + col;

        // height is between 0 and 1. So scale it a bit
        const height = grid[heightGridIndex];
        const scaledHeight = height * 10;

        const cell = new GridPoint(col, row, this.isometric, scaledHeight);
        return cell;
      });
    });

    const centrePoint = this.gridPoints[Math.floor(this.gridPoints.length / 2)][Math.floor(this.gridPoints[0].length / 2)];
    this.isometric.setPosition(centrePoint.coords);
    // this.gridPoints = grid.map((row, index) => {
    //   const rowIndex = Math.floor(index / width);
    //   const colIndex = index % width;
    //   return new GridPoint(colIndex, rowIndex, this.isometric, height))
    // })

    this.gridCells = this.gridPoints.map(row => {
      return row.reduce((gridCells, gridPoint) => {
        const topLeft = gridPoint;
        const topRight = gridPoint.neighbours(this.gridPoints).east;
        const bottomLeft = gridPoint.neighbours(this.gridPoints).south;
        const bottomRight = bottomLeft?.neighbours(this.gridPoints).east;

        if (!topLeft || !topRight || !bottomLeft || !bottomRight) {
          return gridCells;
        }

        gridCells.push(new GridCell(
          topLeft,
          topRight,
          bottomLeft,
          bottomRight,
          gridPoint.x,
          gridPoint.y,
        ));
        return gridCells;
      }, [] as GridCell[])
    })
  }

  public subArray<T extends Coords>(start: T, end: T, array: T[][]): T[][] {
    const bounds = this.subArrayBounds(start, end);
    const subArray = array.slice(bounds.y1, bounds.y2)
      .map(row => row.slice(bounds.x1, bounds.x2));
    return subArray;
  }

  private subArrayBounds(start: Coords, end: Coords): {y1: number, y2: number, x1: number, x2: number} {
    const topLeft = {x: Math.min(start.x, end.x), y: Math.min(start.y, end.y)};
    const bottomRight = {x: Math.max(start.x, end.x), y: Math.max(start.y, end.y)};
    return {y1: topLeft.y, y2: bottomRight.y + 1, x1: topLeft.x, x2: bottomRight.x + 1};
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
    return isEntirelyWithinCell ?? null;
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