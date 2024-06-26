import { store } from "../state/app/store";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { getHeightMap } from "./heightmap";
import { Coords, Isometric } from "./isometric";
import { generateGrid } from "./utils/perlin-noise";

export class Grid {
  public readonly heightStats: {
    min: number,
    max: number,
    // avg: 
  } = {min: Number.MAX_VALUE, max: Number.MIN_VALUE};
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

  constructor(
    width: number, height: number,
    public isometric: Isometric,
  ) {

    // this gets returned as a one dimensional array, of length width * height
    // i.e. it's a flattened 2 dimensional array.
    // const oldgrid = generateGrid(width, height);
    // console.log(oldgrid);

    const perlinMap = generateGrid(width, height);
    // const realMap = getHeightMap(width, height).flat();
    const grid = perlinMap;
    const min = grid.reduce((min, curr) => min = Math.min(curr, min), Number.MAX_VALUE);
    console.log(min);
    // console.log(grid);

    this.gridPoints = Array.from(Array(height), (_, row) => {
      return Array.from(Array(width), (_, col) => {
        // grid is a flattened grid. So, reconstruct what the index should be for this row and col.
        const heightGridIndex = row * width + col;

        // height is between 0 and 1. So scale it a bit
        const height = grid[heightGridIndex];
        const scaledHeight = height * 7;
        if (height >= 0) {

          this.heightStats.max = Math.max(this.heightStats.max, scaledHeight);
          this.heightStats.min = Math.min(this.heightStats.min, scaledHeight);
        }

        const cell = new GridPoint(col, row, this.isometric, scaledHeight);
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
    }).slice(0, -1)
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

  /**
   * to search the grid for cells matching a screen point, instead of iterating through the entire grid,
   * we could instead narrow it down to a search area. This returns the grid x/y min max range to do this.
   * @param x 
   * @param y 
   */
  private minMaxSearchArea(screenX: number, screenY: number, nRows: number, nCols: number) {
    const xMin = this.isometric.inverse(screenX, screenY);
    const minX = Math.max(0, Math.min(xMin.x - 2, nRows - 1));
    const minY = Math.max(0, Math.min(xMin.y - 2, nCols - 1));
    const maxX = Math.max(0, Math.min(xMin.x + 2, nRows - 1));
    const maxY = Math.max(0, Math.min(xMin.y + 2, nCols - 1));
    return {min: {row: minX, col: minY}, max: {row: maxX, col: maxY}};
  }

  private convertToRotatedGridRowCol(x: number, y: number) {

  }
  
  closestCell(x: number, y: number) {
    const area = this.minMaxSearchArea(x, y, this.gridCells.length, this.gridCells[0].length);
    const subGrid = this.subArray(
      this.gridCells
        [area.min.row]
        [area.min.col],
      this.gridCells
        [area.max.row]
        [area.max.col],
      this.gridCells
    )
    // the tricky thing in finding the closest point is that the edges of the cell
    // can be weird shapes due to the heigh differences at the edges

    // first go through each grid cell and just find the ones it could potentially be.
    const withinBoundingCell = subGrid.flat().filter(cell => {
      const isWithinBoundingCorners = cell.topLeft.coords.x <= x
        && cell.bottomRight.coords.x >= x
        && cell.bottomLeft.coords.y >= y
        && cell.topRight.coords.y <= y;
      return isWithinBoundingCorners;
    });

    // now for each of these, do a more thorough check on the boundaries of the cell
    const isEntirelyWithinCell = withinBoundingCell.find(cell => {
      return cell.isPointInsideCell({x, y});
    });
    return isEntirelyWithinCell ?? null;
  }

  closestPoint(x: number, y: number) {
    const area = this.minMaxSearchArea(x, y, this.gridPoints.length, this.gridPoints[0].length);
    const subGrid = this.subArray(
      this.gridPoints
        [area.min.row]
        [area.min.col],
      this.gridPoints
        [area.max.row]
        [area.max.col],
      this.gridPoints);
    
    return subGrid.flat().reduce((closest, point) => {
      const distance = point.distanceToPoint({x, y});
      if (distance < closest.distance) {
        closest = {point, distance};
      }
      return closest;
    }, {point: null, distance: Infinity} as {point: GridPoint | null, distance: number})
  }
}