
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