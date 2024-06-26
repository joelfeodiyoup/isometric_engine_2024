import { throwServerError } from "@apollo/client";
import { Canvas } from "../canvas";
import { Grid } from "../grid";
import { GridCell } from "../grid-cell";
import { colors } from "../../ui/useColours";
import { GridPoint } from "../grid-point";

/**
 * Each canvas has some slightly different build functions.
 * This should abstract that so that other things don't need to worry about it.
 */
export abstract class RenderedGrid {
  constructor(
    protected canvas: Canvas,
    protected grid: Grid
  ) {}
  abstract redraw(): void;

  abstract drawCells(cells: GridCell[]): void;
  abstract drawPoints(points: GridPoint[]): void;
  clear() {
    this.canvas.draw.clear();
  }
  clearAndRedraw() {
    this.clear();
    this.redraw();
  }
}

/**
 * renders images onto cells. e.g. trees/buildings/whatever
 */
export class RenderBuildCanvas extends RenderedGrid {
  drawPoints(points: GridPoint[]): void {
    throw new Error("Method not implemented.");
  }
  drawCells(cells: GridCell[]): void {
    cells.forEach(cell => {
      // cell.isAboveGround && this.canvas.draw.drawImage(cell);
      this.canvas.draw.drawImage(cell);
    })
  }
  constructor(
    canvas: Canvas,
    grid: Grid,
    private isTemp = false
  ) {
    super(canvas, grid);
  }
  redraw() {
    // after drawing an image onto a cell, the build canvas has to be redrawn
    // so that the correct draw order can be done (otherwise images could overlap in the wrong order)
    this.grid.gridCellDrawOrder.flat().forEach((cell, i) => {
      // (this.isTemp || cell.hasImage) && cell.isAboveGround && this.canvas.draw.drawImage(cell);
      (this.isTemp || cell.hasImage) && this.canvas.draw.drawImage(cell);
    })
  }
}

export class RenderOceanCanvas extends RenderedGrid {
  redraw(): void {
    this.grid.gridCells.flat().forEach(cell => {
      if ([cell.topLeft, cell.topRight, cell.bottomLeft, cell.bottomRight].filter(x =>  x.height < 0).length > 0) {
        this.canvas.drawFilledPolygon([cell.topLeft, cell.topRight, cell.bottomRight, cell.bottomLeft].map(c => ({x: c.baseCoords.x, y: c.baseCoords.y})), "aqua");
      }
    })
  }
  drawCells(cells: GridCell[]): void {
    
  }
  drawPoints(points: GridPoint[]): void {
    throw new Error("Method not implemented.");
  }

}

/**
 * handles the rendering of base colours.
 * e.g. solid fills for each cell.
 */
export class RenderBaseCanvas extends RenderedGrid {
  drawPoints(points: GridPoint[]): void {
    throw new Error("Method not implemented.");
  }
  constructor(
    canvas: Canvas,
    grid: Grid,
  ) {
    super(canvas, grid);
  }
  redraw() {
    this.grid.gridCells.flat().forEach((cell) => {
      cell.polygons.forEach(polygon => {
        const brightness = polygon.brightness;
        this.canvas.drawFilledPolygon(polygon.coords, `hsl(90, ${0.5 * (80 + brightness * 5)}%, ${55 + brightness * 3}%)`)
      })
    })
  }
  drawCells(cells: GridCell[]) {
    // this.canvas.draw
  }
}

export class RenderHoverCanvas extends RenderedGrid {
  drawPoints(points: GridPoint[]): void {
    points.forEach(point => this.canvas.drawPoint(point.coords));
  }
  redraw(): void {
    
  }
  drawCells(cells: GridCell[]): void {
    this.clear();
    this.canvas.draw.drawFilledRectangle(
      cells,
      "rgba(255,255,255,0.5)"
    )
  }
  constructor(
    canvas: Canvas,
    grid: Grid,
  ) {
    super(canvas, grid);
  }
}

/**
 * Used for displaying debug visuals to the screen.
 * e.g. some lines to line up the centre of screen
 */
export class RenderDebugCanvas extends RenderedGrid {
  drawPoints(points: GridPoint[]): void {
    throw new Error("Method not implemented.");
  }
  constructor(
    canvas: Canvas,
    grid: Grid,
    private dimensions: {width: number, height: number}
  ) {
    super(canvas, grid);
    console.log(dimensions);
  }
  redraw(): void {
    console.log('drawing debug')
    this.canvas.drawLine(
      {x: this.dimensions.width / 2, y: 0},
      {x: this.dimensions.width / 2, y: this.dimensions.height},
      "red"
    );
    this.canvas.drawLine(
      {x: 0, y: this.dimensions.height / 2},
      {x: this.dimensions.width, y: this.dimensions.height / 2},
      "red"
    )
  }
  drawCells(cells: GridCell[]): void {
    throw new Error("Method not implemented.");
  }
}

export class RenderMinimapCanvas extends RenderedGrid {
  drawPoints(points: GridPoint[]): void {
    throw new Error("Method not implemented.");
  }
  // private lowHeightColor = {red: 110, green: 143, blue: 77};
  private lowHeightColor = {red: 79, green: 95, blue: 63};
  private highHeightColor = {red: 163, green: 207, blue: 120};
  private difference = {
    red: this.highHeightColor.red - this.lowHeightColor.red,
    green: this.highHeightColor.green - this.lowHeightColor.green,
    blue: this.highHeightColor.blue - this.lowHeightColor.blue,
  };
  redraw(): void {
    this.canvas.drawPixels(this.grid.gridCells.flat(), (cell: GridCell) => {
      // if (!cell.isAboveGround) {
      //   return {red: 70, green: 221, blue: 175};
      // }
      if(cell.hasImage) {
        return {red: 55, green: 111, blue: 70};
      } else {
        const heightDifference = (cell.avgHeight - this.grid.heightStats.min) / this.grid.heightStats.max;
        return {
          red: this.lowHeightColor.red + heightDifference * this.difference.red,
          green: this.lowHeightColor.green + heightDifference * this.difference.green,
          blue: this.lowHeightColor.blue + heightDifference * this.difference.blue,
        }
        // return {red: 163, green: 207, blue: 120};
      }
  });
  }
  drawCells(cells: GridCell[]): void {
    
  }
  constructor(
    canvas: Canvas,
    grid: Grid
  ) {
    super(canvas, grid);
  }
}