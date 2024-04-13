import { Canvas } from "./game";
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

  static drawFilledRectangle(cells: GridPoint[], grid: GridPoint[][], canvas: Canvas) {
    cells.forEach(cell => {
      const n = cell.hasFourNeighbours(grid);
      if (!n) {
        return;
      }

      // why am I doing a * -1 on y??
      canvas.drawFilledPolygon([n.topLeft, n.topRight, n.bottomRight, n.bottomLeft].map(cell => ({x: cell.coords.x, y: cell.coords.y})));
    })
  }
}