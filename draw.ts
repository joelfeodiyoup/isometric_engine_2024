
import { Canvas } from "./canvas";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { Coords } from "./isometric";

export type Colors = "black" | "green" | "blue" | "lightgrey" | "lightgreen" | "lightblue" | "white";
export class Draw {
  static clear(canvas: Canvas) {
    canvas.clear();
  }
  static drawGrid(grid: GridPoint[][], canvas: Canvas) {

    const gridColor: Colors = "lightgrey";
    grid.forEach(row => {
      row.forEach(col => {
        const east = col.neighbours(grid).east;
        if (east) {
          canvas.drawLine(col.coords, east.coords, gridColor);
        }
        const south = col.neighbours(grid).south;
        if (south) {
          canvas.drawLine(col.coords, south.coords, gridColor);
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
      
      
      canvas.drawLine(left, underneathLeft, gridColor);
      canvas.drawLine(underneathLeft, underneathMiddle, gridColor);
      canvas.drawLine(underneathMiddle, middle, gridColor);
      canvas.drawLine(underneathMiddle, underneathRight, gridColor);
      canvas.drawLine(underneathRight, right, gridColor);
    }
  }

  static drawFilledRectangle(cells: GridCell[], canvas: Canvas, color: Colors = "blue") {
    cells.forEach(cell => {
      canvas.drawFilledPolygon([cell.topLeft, cell.topRight, cell.bottomRight, cell.bottomLeft].map(cell => ({x: cell.coords.x, y: cell.coords.y})), color);
    })
  }

  static drawPoint(point: GridPoint, canvas: Canvas) {
    canvas.drawPoint(point.coords);
  }
}