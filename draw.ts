import { Canvas } from "./game";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";

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

  static drawFilledRectangle(cells: GridCell[], canvas: Canvas) {
    cells.forEach(cell => {
      canvas.drawFilledPolygon([cell.topLeft, cell.topRight, cell.bottomRight, cell.bottomLeft].map(cell => ({x: cell.coords.x, y: cell.coords.y})));
    })
  }
}