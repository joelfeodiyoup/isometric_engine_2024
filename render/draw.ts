
import { Canvas } from "./canvas";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { Coords } from "./isometric";
// import { Color as Colors } from 'color';

// https://www.w3.org/TR/css-color-4/
// export type Colors: Color;
export type Colors = string;
// export type Colors = "black" | "green" | "blue" | "lightgrey" | "lightgreen" | "lightblue" | "white" | "brown" | "chocolate" | "red";

/**
 * Contains many static methods, which, when passed a Canvas class (which contains a ctx property,
 * has methods to handle drawing onto those.
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
      const left = grid[0]![0]!.coords;
      const underneathLeft = underneath(left);
      const right = grid[grid.length - 1]![grid[0]!.length - 1]!.coords;
      const underneathRight = underneath(right);
      const middle = grid[grid.length - 1]![0]!.coords;
      const underneathMiddle = underneath(middle);
      
      
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
      this.canvas.drawFilledPolygon([cell.topLeft, cell.topRight, cell.bottomRight, cell.bottomLeft].map(cell => ({x: cell.coords.x, y: cell.coords.y})), color);
    })
  }

  drawFilledPolygon(points: Coords[], color: Colors) {
    this.canvas.drawFilledPolygon(points, color);
  }

  drawPoint(point: GridPoint) {
    this.canvas.drawPoint(point.coords);
  }

  drawImage()  {
    // canvas.drawImage();
  }
}