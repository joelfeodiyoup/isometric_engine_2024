import { Canvas } from "./canvas";
import { Grid } from "./grid";
import { GridCell } from "./grid-cell";

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

  abstract drawCell(cell: GridCell): void;
  clear() {
    this.canvas.draw.clear();
  }
  clearAndRedraw() {
    this.clear();
    this.redraw();
  }
}

export class RenderGridCanvas extends RenderedGrid {
  drawCell(cell: GridCell): void {
    throw new Error("Method not implemented.");
  }
  constructor(
    canvas: Canvas,
    grid: Grid,
  ) {
    super(canvas, grid);
  }
  redraw() {
    this.canvas.draw.drawGrid(this.grid.gridPoints);
  }
}

/**
 * renders images onto cells. e.g. trees/buildings/whatever
 */
export class RenderBuildCanvas extends RenderedGrid {
  drawCell(cell: GridCell): void {
    this.canvas.draw.drawImage(cell);
    // cell.drawImage(cell);
  }
  constructor(
    canvas: Canvas,
    grid: Grid,
  ) {
    super(canvas, grid);
  }
  redraw() {
    // after drawing an image onto a cell, the build canvas has to be redrawn
    // so that the correct draw order can be done (otherwise images could overlap in the wrong order)
    this.grid.gridCellDrawOrder.flat().forEach((cell, i) => {
      cell.hasImage && cell.drawImage(cell);
    })
  }
}

/**
 * handles the rendering of base colours.
 * e.g. solid fills for each cell.
 */
export class RenderBaseCanvas extends RenderedGrid {
  constructor(
    canvas: Canvas,
    grid: Grid,
  ) {
    super(canvas, grid);
  }
  redraw() {
    this.grid.gridCells.flat().forEach((cell) => {
      const color = cell.isFilled ? cell.color : "green";
      this.canvas.draw.drawFilledRectangle([cell], color);
    })
  }
  drawCell() {
    this.canvas.draw
  }
}

export class RenderHoverCanvas extends RenderedGrid {
  redraw(): void {
    
  }
  drawCell(cell: GridCell): void {
    this.clear();
    this.canvas.draw.drawFilledRectangle(
      [cell],
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