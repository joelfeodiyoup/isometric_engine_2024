import { stateListenerActions, store } from "../state/app/store";
import { Canvas } from "./canvas";
import { Grid } from "./grid";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { MoveScreenHandler, SelectMultipleCells } from "./click-drag-handlers";
import { Coords } from "./isometric";
import { BuildHtmlElement } from "./build-html-element";

type GameOptions = {
  dimensions: { width: number; height: number };
};

/**
 * the client gets a function callback letting it know, when a user clicks,
 * which grid cell and which point the user has clicked near
 */
type onClickScreen = (
  grid: { x: number; y: number },
  point: { x: number; y: number }
) => void;

/**
 * I'm not sure what will be the best way to implement. So this is a WIP.
 * Basically I want the "game renderer" to be fairly generic.
 * I want to be able to implement this and have the "consumer" determine how different types of cells would be handled on render
 * So possibly this renderer just says "these are the possibilities" (it could be rendered as a filled colour, or as an image, etc)
 * And then the caller of this class can pass in a function that uses the game logic to choose which of these is used, without worrying about implementation details.
 */
type CellBuildRenderTypes = "filled" | "image";

export class GameRender {
  public grid!: Grid;
  private canvasStage!: HTMLElement;
  private container!: HTMLElement;
  private hoveredCell = null as null | GridCell;
  private hoveredPoint = null as null | GridPoint;
  private moveScreenHandler!: MoveScreenHandler;
  private selectMultiplCellsHandler!: SelectMultipleCells;

  private canvases!: {
    canvasHover: Canvas;
    canvasBase: Canvas;
    canvasGrid: Canvas;
    canvasBuild: Canvas;
  };

  constructor(options: GameOptions) {
    stateListenerActions.onZoom = this.redraw.bind(this);
    this.reset(options);
  }

  public reset(options: GameOptions) {
    this.initialise(options);
    this.redraw();
  }

  /**
   * This sets up the html elements needed for the render.
   * On doing a "new game", (currently) it rebuilds all those html elements
   * (this might not be necessary, ultimately. But it does it currently)
   * Event listeners can also be added to those specific elements
   */
  private setupElements() {
    const elements = BuildHtmlElement.getRenderElement();

    // only set the stage element the first time.
    // This stage element could then moved by whatever holds the game.
    // so... who knows where it ends up.
    if (!this.canvasStage) {
      this.canvasStage = elements.canvasStage;
      document.body.appendChild(elements.canvasStage);
    }

    // we can swap out the container from the stage.
    this.canvasStage.replaceChildren(elements.canvasContainer);
    this.container = elements.canvasContainer;

    this.canvases = Object.entries(elements.canvases).reduce((obj, [key, val]) => {
      obj[key as keyof typeof elements.canvases] = new Canvas(val);
      return obj;
    }, {} as Record<keyof typeof elements.canvases, Canvas>);

    this.canvases.canvasHover.setListeners(
      this.clickHandler.bind(this),
      this.mouseHoverHandler.bind(this)
    )
  }

  /**
   * Set up all the objects required for the render
   * Things like the grid, grid cells, listeners, etc
   * @param options 
   */
  private initialise(options: GameOptions) {
    this.setupElements();

    this.grid = new Grid(
      // width and height are actually the number of points.
      // So I'll just add one, so that it'll be the number of cells.
      options.dimensions.width + 1,
      options.dimensions.height + 1,
      this.drawCellFill.bind(this),
      this.drawCellImage.bind(this),
      this.drawBaseCellFill.bind(this)
    );

    this.moveScreenHandler = new MoveScreenHandler(
      this.canvasStage,
      { x: 0, y: 0 },
      this.setCameraPosition.bind(this)
    );
    this.selectMultiplCellsHandler = new SelectMultipleCells(
      this.canvases.canvasHover.canvas,
      (coords: Coords) => this.grid.closestCell(coords.x, coords.y),
      (coords: Coords) => this.grid.closestPoint(coords.x, coords.y).point,
      (start: GridCell, end: GridCell) => {
        const selectedCells = this.grid
        .subArray(start, end, this.grid.gridCells)
        .flat();

        // I need to figure out what should be done, when clicking the cell. E.g. build something, debug something, remove something, ... something else?
        // This might want to be abstracted. Firstly, let's see how it looks, non-abstracted...
        const actionType = store.getState().gameControls.value.clickAction;
        switch (actionType) {
          case "debug":
            // A bit crude. But sometimes you just want to quickly click a cell and see what it contains.
            console.log(selectedCells);
            return;
          case "build":
            selectedCells.forEach((cell) => this.changedStateofClickedCell(cell));
            this.renderCellsClicked(selectedCells);
            return;
          default:
            return;
        }

      },
      (start: GridPoint, end: GridPoint) => {
        const points = this.grid.subArray(start, end, this.grid.gridPoints);

        // figure out which action to do for this point that was clicked
        const actionType = store.getState().gameControls.value.clickAction;
        switch (actionType) {
          case "debug":
            console.log(points);
            return;
          case "lower": // both lower and raise are currently doing the same thing. Switch statement fall through.
          case "raise":
            this.handlePointClicked(points.flat(), start.height);
            return;
          return;
        }
      },
      () => {
        return store.getState().gameControls.value.highlightType === "cell";
      }
    );
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
    } else {
      cell.drawBaseCellFill(cell);
    }
  }

  /**
   * Todo: each cell could have an image draw onto it.
   * This function tells how that should happen.
   * @param cell
   */
  private drawCellImage(cell: GridCell) {
    this.canvases.canvasBuild.draw.drawImage(cell);
  }

  private drawBaseCellFill(cell: GridCell) {
    this.canvases.canvasBase.draw.drawFilledRectangle([cell], "green");
  }

  /**
   * reset everything and draw everything.
   */
  public redraw() {
    this.clearAll();
    // draw all the filled squares
    this.grid.gridCells.flat().forEach((cell) => cell.drawBaseCellFill(cell));
    // this.canvases.canvasGrid.draw.drawFilledRectangle(this.grid.gridCells.flat());
    // draw the grid (the lines)
    this.redrawRender();
  }

  private clearAll() {
    Object.values(this.canvases).forEach(canvas => canvas.clear());
  }

  private cellHandler(x: number, y: number) {
    const closest = this.grid.closestCell(x, y);
    if (closest) {
      const userColor = store.getState().user.value.color;
      if (closest.color === userColor) {
        // closest.color = null;
        closest.isFilled = false;
      } else {
        closest.isFilled = true;
        // closest.color = userColor;
      }
      closest.drawFill(closest);
      console.log(closest);
    }
  }

  /**
   * I'm not sure this approach is best:
   * When the user clicks a cell, he could click one or many.
   * This function is called to just change the state of one cell that was clicked.
   * Later, something else triggers the actual re-render (handleAllCellsClickedBuild),
   * This is so that the render can all be done as one process.
   * @param cell 
   */
  private changedStateofClickedCell(cell: GridCell) {
    const userColor = store.getState().user.value.color;
    cell.isFilled = true;
    // cell.color = userColor;
    cell.hasImage = true;
  }
  
  /**
   * This handles the actual render of 
   * @param cells 
   */
  private renderCellsClicked(cells: GridCell[]) {
    // after drawing an image onto a cell, the build canvas has to be redrawn
    // so that the correct draw order can be done (otherwise images could overlap in the wrong order)
    this.redrawBuildLayer();
  }

  private redrawBuildLayer() {
    this.grid.gridCellDrawOrder.forEach(cell => {
      if (cell.hasImage) {
        cell.drawImage(cell);
      }
    })
  }

  private pointHandler(x: number, y: number) {
    const closest = this.grid.closestPoint(x, y);
    const actionType = store.getState().gameControls.value.clickAction;
    if (actionType === "raise" || actionType === "lower") {
      closest.point?.adjustHeight(actionType);
    }
    return closest.point;
  }

  private handlePointClicked(points: GridPoint[], firstCellHeight: number) {
    const actionType = store.getState().gameControls.value.clickAction;

    // if the user selects a lot of points, make all of those points the same height as the first on.
    const makeAllSameHeight = points.length > 1;
    if (makeAllSameHeight) {
      const height = firstCellHeight ?? 0;
      points.forEach((point) => point.setHeight(height));
    } else if (actionType === "raise" || actionType === "lower") {
      // we're adjusting just one point, so just adjust it.
      points[0]?.adjustHeight(actionType);
    }
    this.redrawRender();
  }

  private clickHandler(x: number, y: number) {
    const state = store.getState();
    state.gameControls.value.highlightType === "cell"
      ? this.cellHandler(x, y)
      : this.pointHandler(x, y);

    /**
     * whenever the action was raising or lowering a part of the grid,
     * Then the grid needs to be drawn again.
     */
    if (
      state.gameControls.value.clickAction === "lower" ||
      state.gameControls.value.clickAction === "raise"
    ) {
      this.redrawRender();
    }
  }

  private setHoveredCell(x: number, y: number) {
    const closestCell = this.grid.closestCell(x, y);
    if (!closestCell) {
      return;
    }
    if (
      this.hoveredCell?.x === closestCell.x &&
      this.hoveredCell.y === closestCell.y
    ) {
    } else {
      this.hoveredCell = closestCell;
      this.canvases.canvasHover.clear();
      // draw a transparent rectangle over the cell.
      closestCell &&
        this.canvases.canvasHover.draw.drawFilledRectangle(
          [closestCell],
          "rgba(255,255,255,0.5"
        );
    }
  }
  private setHoveredPoint(x: number, y: number) {
    const closestPoint = this.grid.closestPoint(x, y).point;
    if (!closestPoint) {
      return;
    }
    if (
      this.hoveredPoint?.coords.x === closestPoint.coords.x &&
      this.hoveredPoint.coords.y === closestPoint.coords.y
    ) {
    } else {
      this.hoveredPoint = closestPoint;
      this.canvases.canvasHover.clear();
      this.hoveredPoint &&
        this.canvases.canvasHover.draw.drawPoint(this.hoveredPoint);
    }
  }
  private mouseHoverHandler(x: number, y: number) {
    const state = store.getState();
    state.gameControls.value.highlightType === "cell"
      ? this.setHoveredCell(x, y)
      : this.setHoveredPoint(x, y);
  }

  private redrawRender() {
    this.canvases.canvasGrid.draw.clear();
    this.canvases.canvasBase.draw.clear();
    this.drawCells();
    this.drawGrid();
  }

  private drawGrid() {
    this.canvases.canvasGrid.draw.drawGrid(this.grid.gridPoints);
  }

  private drawCells() {
    this.grid.gridCells.flat().forEach((cell, i) => {
      cell.drawFill(cell);
    });
  }

  private setCameraPosition({ x, y }: { x: number; y: number }) {
    if (this.container) {
      this.container.style.left = `${x}px`;
      this.container.style.top = `${y}px`;
    }
  }
}
