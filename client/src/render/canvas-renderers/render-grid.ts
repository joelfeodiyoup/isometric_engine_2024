import { store } from "../../state/app/store";
import { Canvas } from "../canvas";
import { Colors } from "../draw";
import { Grid } from "../grid";
import { GridCell } from "../grid-cell";
import { GridPoint } from "../grid-point";
import { Coords } from "../isometric";
import { RenderedGrid } from "./rendered-grid";

export class RenderGridCanvas extends RenderedGrid {
  drawPoints(points: GridPoint[]): void {
    throw new Error("Method not implemented.");
  }
  drawCells(cells: GridCell[]): void {
    throw new Error("Method not implemented.");
  }
  constructor(
    canvas: Canvas,
    grid: Grid,
  ) {
    super(canvas, grid);
  }
  redraw() {
    this.drawGrid(this.grid.gridPoints);
  }

  private drawGrid(grid: GridPoint[][]) {

    const gridColor: Colors = "white";
    // const gridColor: Colors = "lightgrey";
    const generateGridLines = false;
    if (generateGridLines) {

      grid.forEach(row => {
        row.forEach(col => {
          const east = col.neighbours(grid).east;
          if (east) {
            // this.canvas.drawLine(col.coords, east.coords, gridColor);
          }
          const south = col.neighbours(grid).south;
          if (south) {
            // this.canvas.drawLine(col.coords, south.coords, gridColor);
          }
        })
      })
    }

    // I'd like to render something so that underneath the land there is an underground area.
    const showSubterrain = true;
    if (showSubterrain) {
      const underneath = (point: GridPoint) => point.calculateSubTerrainPoint();
      const aboveAndBelow = (gridPoint: GridPoint) => {
        return [gridPoint.coords, underneath(gridPoint)] as [Coords, Coords];
      }

      const nRows = grid.length;
      const nCols = grid[0].length;

      const points = [
        grid[0]![0]!,
        grid[grid.length - 1]![0]!,
        grid[grid.length - 1]![grid[0]!.length - 1]!,
        grid[0]![grid.length -1]!
      ];
      const rotation = store.getState().gameControls.value.rotation;
      const [left, underneathLeft] = aboveAndBelow(points[(4 - rotation) % 4]);
      const [middle, underneathMiddle] = aboveAndBelow(points[(1 + 4 - rotation) % 4]);
      const [right, underneathRight] = aboveAndBelow(points[(2 + 4 - rotation) % 4]);
      
      this.canvas.drawLine(left, underneathLeft, gridColor);
      this.canvas.drawLine(underneathLeft, underneathMiddle, gridColor);
      this.canvas.drawLine(underneathMiddle, middle, gridColor);
      this.canvas.drawLine(underneathMiddle, underneathRight, gridColor);
      this.canvas.drawLine(underneathRight, right, gridColor);

      const edges = [
        (cell: GridPoint) => cell.x === 0,
        (cell: GridPoint) => cell.y === nRows - 1,
      ].map(f => grid.flat().filter(cell => f(cell)));

      const terrainSet = (points: GridPoint[]) => {
        const startPiece = underneath(points[0]);
        const endPiece = underneath(points[points.length - 1]);
        return [startPiece, ...points.map(p => p.coords), endPiece];
      }
      const waterEdgeSet= (points: GridPoint[]) => {
        return [points[0].baseCoords, underneath(points[0]), underneath(points[points.length - 1]), points[points.length - 1].baseCoords];
      }

      const oceanSideColor = "rgba(4,105,200,0.5)"
      const oceanSideColorDarker = "rgba(0,44,126,0.5)"
      this.canvas.drawFilledPolygon(waterEdgeSet(edges[0]), oceanSideColor);
      this.canvas.drawFilledPolygon(waterEdgeSet(edges[1]), oceanSideColorDarker);

      this.canvas.drawFilledPolygon(terrainSet(edges[0]), "tan");
      this.canvas.drawFilledPolygon(terrainSet(edges[1]), "peru");
    }
  }
}