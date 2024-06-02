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

  abstract drawCells(cells: GridCell[]): void;
  clear() {
    this.canvas.draw.clear();
  }
  clearAndRedraw() {
    this.clear();
    this.redraw();
  }
}

export class RenderGridCanvas extends RenderedGrid {
  drawCells(cells: GridCell[]): void {
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
  drawCells(cells: GridCell[]): void {
    cells.forEach(cell => {
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
      (this.isTemp || cell.hasImage) && this.canvas.draw.drawImage(cell);
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
  drawCells(cells: GridCell[]) {
    // this.canvas.draw
  }
}

export class RenderHoverCanvas extends RenderedGrid {
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