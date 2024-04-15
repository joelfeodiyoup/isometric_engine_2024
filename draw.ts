
import { Canvas } from "./canvas";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";

export type Colors = "green" | "blue" | "lightgrey" | "lightgreen";
export class Draw {
  static clear(canvas: Canvas) {
    canvas.clear();
  }
  static drawGrid(grid: GridPoint[][], canvas: Canvas) {

    grid.forEach(row => {
      row.forEach(col => {
        const east = col.neighbours(grid).east;
        if (east) {
          canvas.drawLine(col.coords, east.coords);
        }
        const south = col.neighbours(grid).south;
        if (south) {
          canvas.drawLine(col.coords, south.coords);
        }
      })
    })
  }

  static drawFilledRectangle(cells: GridCell[], canvas: Canvas, color: Colors = "green") {
    cells.forEach(cell => {
      canvas.drawFilledPolygon([cell.topLeft, cell.topRight, cell.bottomRight, cell.bottomLeft].map(cell => ({x: cell.coords.x, y: cell.coords.y})), color);
    })
  }

  static drawPoint(point: GridPoint, canvas: Canvas) {
    canvas.drawPoint(point.coords);
  }
}