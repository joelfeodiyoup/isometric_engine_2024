
import { store } from "../state/app/store";
import { Canvas } from "./canvas";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { Coords } from "./isometric";
import { rectangleMidPoint, rectangleVerticalMidPoint } from "./utils/maths";
// import { Color as Colors } from 'color';

// https://www.w3.org/TR/css-color-4/
// export type Colors: Color;
export type Colors = string;
// export type Colors = "black" | "green" | "blue" | "lightgrey" | "lightgreen" | "lightblue" | "white" | "brown" | "chocolate" | "red";

/**
 * methods for drawing onto a Canvas object (which contains its context)
 */
export class Draw {
  constructor(private canvas: Canvas) {}
  clear() {
    this.canvas.clear();
  }
  drawGrid(grid: GridPoint[][]) {

    const gridColor: Colors = "white";
    // const gridColor: Colors = "lightgrey";
    grid.forEach(row => {
      row.forEach(col => {
        const east = col.neighbours(grid).east;
        if (east) {
          this.canvas.drawLine(col.coords, east.coords, gridColor);
        }
        const south = col.neighbours(grid).south;
        if (south) {
          this.canvas.drawLine(col.coords, south.coords, gridColor);
        }
      })
    })

    // I'd like to render something so that underneath the land there is an underground area.
    const showSubterrain = true;
    if (showSubterrain) {
      const depth = 100;
      const underneath = (point: GridPoint) => ({x: point.coords.x, y: point.baseCoords.y + depth});
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

      this.canvas.drawFilledPolygon(terrainSet(edges[0]), "tan");
      this.canvas.drawFilledPolygon(terrainSet(edges[1]), "peru");
    }
  }

  drawFilledRectangle(cells: GridCell[], color: Colors = "green") {
    cells.forEach(cell => {
      this.canvas.drawFilledPolygon([
        cell.topLeft,
        cell.topRight,
        cell.bottomRight,
        cell.bottomLeft
      ].map(
        cell => ({x: cell.coords.x, y: cell.coords.y})
      ), color);
    })
  }

  drawFilledPolygon(points: Coords[], color: Colors) {
    this.canvas.drawFilledPolygon(points, color);
  }

  drawPoint(point: GridPoint) {
    this.canvas.drawPoint(point.coords);
  }

  drawImage(cell: GridCell)  {
    // for an isometric grid, the "top right" and "bottom left" corner are always vertically above/below each other.
    const center = rectangleVerticalMidPoint(cell.topRight.coords, cell.bottomLeft.coords);
    this.canvas.drawImage(center, cell.imageSource);
  }
}