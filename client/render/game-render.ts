import { store } from "../state/app/store";
import { Canvas, CanvasWithMouseLiseners } from "./canvas";
import { Grid } from "./grid";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { MoveScreenHandler, SelectMultipleCells } from "./click-drag-handlers";
import { Coords } from "./isometric";

type GameOptions = {
  dimensions: {width: number, height: number},
}

/**
 * the client gets a function callback letting it know, when a user clicks,
 * which grid cell and which point the user has clicked near
 */
type onClickScreen = (
  grid: {x: number, y: number},
  point: {x: number, y: number}
) => void;

/**
 * I'm not sure what will be the best way to implement. So this is a WIP.
 * Basically I want the "game renderer" to be fairly generic.
 * I want to be able to implement this and have the "consumer" determine how different types of cells would be handled on render
 * So possibly this renderer just says "these are the possibilities" (it could be rendered as a filled colour, or as an image, etc)
 * And then the caller of this class can pass in a function that uses the game logic to choose which of these is used, without worrying about implementation details.
 */
type CellBuildRenderTypes = "filled" | "image";

export class GameRender  {
  public readonly grid: Grid;
  private canvasStage;
  private container;
  private hoveredCell = null as null | GridCell;
  private hoveredPoint = null as null | GridPoint;
  private moveScreenHandler: MoveScreenHandler;
  private selectMultiplCellsHandler: SelectMultipleCells;

  private canvases: {
    canvasHover: Canvas,
    canvasBase: Canvas,
    canvasGrid: Canvas,
    canvasBuild: Canvas,
  }

  constructor(options: GameOptions) {
    this.grid = new Grid(
      options.dimensions.width,
      options.dimensions.height,
      this.drawCellFill.bind(this),
      this.drawCellImage.bind(this),
      this.drawBaseCellFill.bind(this),
    );
    /** I'm doing an assertion that these exist. I don't like that. */
    this.canvasStage = document.getElementById("canvas-stage")!;
    this.container = document.getElementById('canvas-container')!;

    this.canvases = {
      // canvasHover: new Canvas(
      //   "canvas-hover",
      //   // this.clickHandler.bind(this),
      //   // this.mouseHoverHandler.bind(this)
      // ),
      canvasHover: new CanvasWithMouseLiseners(
        "canvas-hover",
        this.clickHandler.bind(this),
        this.mouseHoverHandler.bind(this)
      ),
      canvasBase: new Canvas("canvas-base"),
      canvasGrid: new Canvas("canvas-grid"),
      canvasBuild: new Canvas("canvas-build"),
    };

    this.moveScreenHandler = new MoveScreenHandler(
      this.canvasStage,
      {x: 0, y: 0},
      this.setCameraPosition.bind(this)
    )
    this.selectMultiplCellsHandler = new SelectMultipleCells(
      this.canvases.canvasHover.canvas,
      (coords: Coords) => this.grid.closestCell(coords.x, coords.y),
      (coords: Coords) => this.grid.closestPoint(coords.x, coords.y).point,
      (start: GridCell, end: GridCell) => {
        this.grid.subArrayCells(start, end).flat().forEach(cell => this.handleCellClicked(cell));
        // this.drawGrid();
      },
      (start: GridPoint, end: GridPoint) => {
        console.log(start);
      },
      () => {
        return store.getState().gameControls.value.highlightType === "cell"
      }
    )

    this.setup();
  }

  /**
   * Hopefully something outside this can use this to grab the entire canvas container,
   * and then put it wherever it wants.
   * @returns 
   */
  public element() {
    return this.canvasStage;
  }

  /**
   * Each cell can be filled. This function tells each cell how it should render that.
   * @param cell 
   * @param color 
   */
  private drawCellFill(cell: GridCell) {
    if (cell.isFilled && cell.color) {
      this.canvases.canvasBase.draw.drawFilledRectangle([cell], cell.color);
    }
    else {
      cell.drawBaseCellFill(cell);
    }
  }

  /**
   * Todo: each cell could have an image draw onto it.
   * This function tells how that should happen.
   * @param cell 
   */
  private drawCellImage(cell: GridCell) {

  }

  private drawBaseCellFill(cell: GridCell) {
    this.canvases.canvasBase.draw.drawFilledRectangle([cell], "green");
  }

  private setup() {
    // draw all the filled squares
    this.grid.gridCells.flat().forEach(cell => cell.drawBaseCellFill(cell));
    // this.canvases.canvasGrid.draw.drawFilledRectangle(this.grid.gridCells.flat());
    // draw the grid (the lines)
    this.redrawRender();
  }

  private cellHandler(x: number, y: number) {
    const closest = this.grid.closestCell(x, y);
    if (closest) {
      const userColor = store.getState().user.value.color;
      if (closest.color === userColor) {
        closest.color = null;
        closest.isFilled = false;
      } else {
        closest.isFilled = true;
        closest.color = userColor;
      }
      closest.drawFill(closest);
      console.log(closest);
    }
  }

  private handleCellClicked(cell: GridCell) {
    const userColor = store.getState().user.value.color;
    // if (cell.color === userColor) {
    //   cell.color = null;
    //   cell.isFilled = false;
    // } else {
      cell.isFilled = true;
      cell.color = userColor;
    // }
    cell.drawFill(cell);
  }
  
  private pointHandler (x: number, y: number) {
    const closest = this.grid.closestPoint(x, y);
    const actionType = store.getState().gameControls.value.clickAction;
    if (actionType === "raise" || actionType === "lower") {
      closest.point?.adjustHeight(actionType);
    }
    return closest.point;
  }
  
  private clickHandler (x: number, y: number) {
    const state = store.getState();
    state.gameControls.value.highlightType === "cell"
      ? this.cellHandler(x, y)
      : this.pointHandler(x, y);

    /**
     * whenever the action was raising or lowering a part of the grid,
     * Then the grid needs to be drawn again.
     */
    if (state.gameControls.value.clickAction === "lower" || state.gameControls.value.clickAction === "raise") {
      this.redrawRender();
    }
  };

  private setHoveredCell(x: number, y: number) {
    const closestCell = this.grid.closestCell(x, y);
    if (!closestCell) { return;}
    if (this.hoveredCell?.x === closestCell.x && this.hoveredCell.y === closestCell.y) {
    
    } else {
      this.hoveredCell = closestCell;
      this.canvases.canvasHover.clear();
      // draw a transparent rectangle over the cell.
      closestCell && this.canvases.canvasHover.draw.drawFilledRectangle([closestCell], "rgba(255,255,255,0.5");
      console.log('drawing hover');
    }
  }
  private setHoveredPoint (x: number, y: number) {
    const closestPoint = this.grid.closestPoint(x, y).point;
    if (!closestPoint) { return;}
    if (this.hoveredPoint?.coords.x === closestPoint.coords.x && this.hoveredPoint.coords.y === closestPoint.coords.y) {
  
    } else {
      this.hoveredPoint = closestPoint;
      this.canvases.canvasHover.clear();
      this.hoveredPoint && this.canvases.canvasHover.draw.drawPoint(this.hoveredPoint)
    }
  }
  private mouseHoverHandler (x: number, y: number) {
    const state = store.getState();
    state.gameControls.value.highlightType === "cell"
      ? this.setHoveredCell(x, y)
      : this.setHoveredPoint(x, y);
  }

  private redrawRender() {
    this.canvases.canvasGrid.draw.clear();
    this.drawCells();
    this.drawGrid();
  }
  
  private drawGrid() {
    this.canvases.canvasGrid.draw.drawGrid(this.grid.gridPoints);
  }

  private drawCells() {
    this.grid.gridCells.flat().forEach((cell, i) => {
      cell.drawFill(cell);
    })
  }
  
  private setCameraPosition({x, y}: {x: number, y: number}) {
    if (this.container) {
      this.container.style.left = `${x}px`;
      this.container.style.top = `${y}px`;
    }
  }
}
