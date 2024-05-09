import { store } from "../state/app/store";
import { Canvas, CanvasGrid, CanvasHover } from "./canvas";
import { Grid } from "./grid";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { ScreenPosition } from "./screen-position";

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



export class GameRender {
  public readonly grid: Grid;
  private canvasStage;
  private container;
  private canvasGrid: Canvas;
  private canvasHover: Canvas;
  private hoveredCell = null as null | GridCell;
  private hoveredPoint = null as null | GridPoint;
  private screenPosition: ScreenPosition;

  /**
   * there will be a few different canvas elements inside the wrapper
   * Sometimes I want to resize them.
   * There's probably a better way to do this. I'll figure it out later.
   * */
  private canvasElementIds = ["canvas", "canvas-hover"];

  constructor(options: GameOptions) {
    this.grid = new Grid(options.dimensions.width, options.dimensions.height);
    /** I'm doing an assertion that these exist. I don't like that. */
    this.canvasStage = document.getElementById("canvas-stage")!;
    this.container = document.getElementById('canvas-container')!;

    const originElementPosition = new ScreenPosition({x: 0, y: 0}, ({x, y}: {x: number, y: number}) => {});
    this.screenPosition = new ScreenPosition({x: 0, y: 0}, this.setCameraPosition.bind(this));

    this.canvasGrid = new CanvasGrid(/*originElementPosition, clickHandler, mouseHoverHandler*/);
    this.canvasHover = new CanvasHover(originElementPosition, this.clickHandler.bind(this), this.mouseHoverHandler.bind(this));

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

  private setup() {
    // draw all the filled squares
    this.canvasGrid.draw.drawFilledRectangle(this.grid.gridCells.flat());
    // draw the grid (the lines)
    this.drawGrid();

    this.grid.gridCells.flat().forEach((cell, i) => {
      this.drawCell(cell, i);
    })

    this.canvasStage.addEventListener("mousedown", event => {
      if (!this.isRightClick(event)) { return; }
      this.screenPosition.startScroll(event.clientX, event.clientY)
      event.preventDefault();
    });
    this.canvasStage.addEventListener("mousemove", event => {
      this.screenPosition.midScroll(event.clientX, event.clientY);
    })
    
    this.canvasStage.addEventListener("mouseup", event => {
      if (!this.isRightClick(event)) { return; }
      this.screenPosition.endScroll(event.clientX, event.clientY);
    })
  }

  private isRightClick(event: MouseEvent) {
    return event.button === 2;
  }

  public onWindowResize(widthPx: number, heightPx: number) {
    this.canvasStage.style.width = `${widthPx}px`;
    this.canvasStage.style.height = `${heightPx}px`;
  }

  private cellHandler(x: number, y: number) {
    const closest = this.grid.closestCell(x, y);
    if (closest) {
      closest.isFilled = !closest.isFilled;
    }
  }
  
  private pointHandler (x: number, y: number) {
    const closest = this.grid.closestPoint(x, y);
    console.log(closest.point);
    const actionType = store.getState().clickAction.value;
    if (actionType === "raise" || actionType === "lower") {
      closest.point?.adjustHeight(actionType);
    }
    return closest.point;
  }
  
  private clickHandler (x: number, y: number) {
    const state = store.getState();
    state.highlightType.value === "cell"
      ? this.cellHandler(x, y)
      : this.pointHandler(x, y);
    const filled = this.grid.gridCells.flat().filter(cell => cell.isFilled);
    this.canvasGrid.draw.clear;
    this.canvasGrid.draw.drawFilledRectangle(filled);
    this.drawGrid();
  };

  private setHoveredCell(x: number, y: number) {
    const closestCell = this.grid.closestCell(x, y);
    if (!closestCell) { return;}
    if (this.hoveredCell?.x === closestCell.x && this.hoveredCell.y === closestCell.y) {
    
    } else {
      this.hoveredCell = closestCell;
      this.canvasHover.clear();
      closestCell && this.canvasHover.draw.drawFilledRectangle([closestCell], "darkgreen");
    }
  }
  private setHoveredPoint (x: number, y: number) {
    const closestPoint = this.grid.closestPoint(x, y).point;
    if (!closestPoint) { return;}
    if (this.hoveredPoint?.coords.x === closestPoint.coords.x && this.hoveredPoint.coords.y === closestPoint.coords.y) {
  
    } else {
      this.hoveredPoint = closestPoint;
      this.canvasHover.clear();
      this.hoveredPoint && this.canvasHover.draw.drawPoint(this.hoveredPoint)
    }
  }
  private mouseHoverHandler (x: number, y: number) {
    const state = store.getState();
    state.highlightType.value === "cell"
      ? this.setHoveredCell(x, y)
      : this.setHoveredPoint(x, y);
  }
  
  private drawGrid() {
    this.canvasGrid.draw.drawGrid(this.grid.gridPoints);
  }
  
  private drawCell(cell: GridCell, i: number) {
    this.canvasGrid.drawImage({x: cell.topLeft.coords.x, y: cell.topRight.coords.y}, {x: cell.bottomRight.coords.x, y: cell.bottomLeft.coords.y}, i);
  }
  // drawCell(game.grid.gridCells.flat()[1]!);
  
  private setCameraPosition({x, y}: {x: number, y: number}) {
    if (this.container) {
      this.container.style.left = `${x}px`;
      this.container.style.top = `${y}px`;
    }
  }
}
