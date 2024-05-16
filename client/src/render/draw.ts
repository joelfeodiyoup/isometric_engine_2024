
import { Canvas } from "./canvas";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { Coords } from "./isometric";
import { rectangleMidPoint } from "./utils/maths";
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

    const gridColor: Colors = "lightgrey";
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
      const underneath = ({x, y}: Coords) => ({x, y: y + depth});
      const aboveAndBelow = (gridPoint: GridPoint) => {
        return [gridPoint.coords, underneath(gridPoint.coordsAtSeaLevel)] as [Coords, Coords];
      }
      const [left, underneathLeft] = aboveAndBelow(grid[0]![0]!);
      const [middle, underneathMiddle] = aboveAndBelow(grid[grid.length - 1]![0]!);
      const [right, underneathRight] = aboveAndBelow(grid[grid.length - 1]![grid[0]!.length - 1]!);
      
      
      this.canvas.drawLine(left, underneathLeft, gridColor);
      this.canvas.drawLine(underneathLeft, underneathMiddle, gridColor);
      this.canvas.drawLine(underneathMiddle, middle, gridColor);
      this.canvas.drawLine(underneathMiddle, underneathRight, gridColor);
      this.canvas.drawLine(underneathRight, right, gridColor);

      const soil = [...grid.map(row => row[0]!), underneathMiddle, underneathLeft];
      this.canvas.drawFilledPolygon([...grid.map(row => row[0]!.coords), underneathMiddle, underneathLeft], "tan");
      this.canvas.drawFilledPolygon([...grid[grid.length - 1]!.map(cell => cell.coords), underneathRight, underneathMiddle], "peru");
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
    const center = rectangleMidPoint(cell.topLeft.coords, cell.topRight.coords, cell.bottomLeft.coords, cell.bottomRight.coords);
    this.canvas.drawImage(center);
  }
}