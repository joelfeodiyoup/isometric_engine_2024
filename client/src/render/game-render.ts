import { stateListenerActions, store } from "../state/app/store";
import { Canvas } from "./canvas";
import { Grid } from "./grid";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { MoveScreenHandler, SelectMultipleCells } from "./click-drag-handlers";
import { Coords, Isometric } from "./isometric";
import { BuildHtmlElement } from "./build-html-element";
import { RenderBaseCanvas, RenderBuildCanvas, RenderDebugCanvas, RenderGridCanvas, RenderHoverCanvas, RenderMinimapCanvas, RenderedGrid } from "./rendered-grid";

type GameOptions = {
  dimensions: { width: number; height: number };
};

export class GameRender {
  public grid!: Grid;
  private canvasStage!: HTMLElement;
  private minimapElement!: HTMLCanvasElement;
  private container!: HTMLElement;
  private hoveredCell = null as null | GridCell;
  private hoveredPoint = null as null | GridPoint;
  private moveScreenHandler!: MoveScreenHandler;
  private selectMultiplCellsHandler!: SelectMultipleCells;

  /** Each canvas renders things a bit differently. Details hidden inside each implementation */
  private canvasRenderers: {
    debug: RenderedGrid,
    grid: RenderedGrid,
    base: RenderedGrid,
    build: RenderedGrid,
    buildTemp: RenderedGrid,
    hover: RenderedGrid,
    minimap: RenderedGrid,
  }

  // TODO: I think I should be able to remove this and replace with the thing above, soon.
  private canvases!: {
    debug: Canvas;
    canvasHover: Canvas;
    canvasBase: Canvas;
    canvasGrid: Canvas;
    canvasBuild: Canvas;
    canvasBuildTemp: Canvas;
    canvasMouseHandler: Canvas;
    minimap: Canvas;
  };

  constructor(options: GameOptions) {
    stateListenerActions.onZoom = this.zoom.bind(this);
    stateListenerActions.onRotate = this.redraw.bind(this);
    this.reset(options);
  }

  private zoom() {
    console.log('received zoom');
    const zoom = store.getState().gameControls.value.zoomLevel;
    this.grid.isometric.setZoom(zoom);
    this.setCanvasDimensions(this.grid.isometric.minDimensions());
    this.centreScreen();
    this.redraw();
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
    const dimensions = store.getState().gameState.value.dimensions;
    const elements = BuildHtmlElement.getRenderElement(dimensions);

    // only set the stage element the first time.
    // This stage element could then moved by whatever holds the game.
    // so... who knows where it ends up.
    if (!this.canvasStage) {
      this.canvasStage = elements.canvasStage;
      document.body.appendChild(elements.canvasStage);
      this.minimapElement = elements.minimapCanvas;
      document.body.appendChild(elements.minimapCanvas);
    } else {
      this.minimapElement.width = dimensions.width;
      this.minimapElement.height = dimensions.height;
    }
    const desiredWidth = 100;
    const scaleAmount = desiredWidth / this.minimapElement.width;
    this.minimapElement.style.transform = `scale(${scaleAmount})`;


    // we can swap out the container from the stage.
    this.canvasStage.replaceChildren(elements.canvasContainer, elements.debugCanvas);
    this.container = elements.canvasContainer;

    this.canvases = {
      ...Object.entries(elements.canvases).reduce((obj, [key, val]) => {
        obj[key as keyof typeof elements.canvases] = new Canvas(val);
        return obj;
      }, {} as Record<keyof typeof elements.canvases, Canvas>),
      debug: new Canvas(elements.debugCanvas),
      minimap: new Canvas(this.minimapElement),
    }
  }

  private setupMinimap() {
    
  }

  private setCanvasDimensions(dimensions: {width: number, height: number}) {
    Object.entries(this.canvases).forEach(([key, canvas]) => {
      if (key !== "debug" && key !== "minimap") {
        canvas.canvas.width = dimensions.width;
        canvas.canvas.height = dimensions.height;
      }
    })
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
      {x: this.canvasStage.clientWidth, y: this.canvasStage.clientHeight}
    );
    const canvasDimensions = this.grid.isometric.minDimensions();

    this.setCanvasDimensions(canvasDimensions);
    const initLeftOffset = (this.canvasStage.clientWidth / 2) - (canvasDimensions.width / 2);
    const initTopOffset = (this.canvasStage.clientHeight / 2) - (canvasDimensions.height / 2);

    // handler for moving the screen. Element to watch, and function to handle the updates.
    this.moveScreenHandler = new MoveScreenHandler(
      this.canvasStage,
      { 
        x: initLeftOffset,
        y: initTopOffset 
      },
      ({ x, y }: { x: number; y: number }) => {
        if (this.container) {
          this.container.style.left = `${x}px`;
          this.container.style.top = `${y}px`;
        }
      }
    );

    const elementForMouseHandler = this.canvases.canvasMouseHandler;
    elementForMouseHandler.setListeners({
      onMouseMove: this.mouseHoverHandler.bind(this)
    });
    this.selectMultiplCellsHandler = new SelectMultipleCells(
      elementForMouseHandler.canvas,
      (coords: Coords) => this.grid.closestCell(coords.x, coords.y),
      (coords: Coords) => this.grid.closestPoint(coords.x, coords.y).point,
      (start: GridCell, end: GridCell, isIntermediate: boolean) => {
        const selectedCells = this.grid.rotateGrid(this.grid
        .subArray(start, end, this.grid.gridCells))
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
            if (isIntermediate) {
              this.canvasRenderers.buildTemp.clear();
              this.canvasRenderers.buildTemp.drawCells(selectedCells);


              // TODO: this is not good for performance. It redraws it on every move, even if the cells didn't change.
              this.canvasRenderers.hover.clear();
              this.canvasRenderers.hover.drawCells(selectedCells);
            } else {
              this.canvasRenderers.hover.clear();
              this.canvasRenderers.buildTemp.clear();
              selectedCells.forEach((cell) => {
                cell.hasImage = true;
              });
              this.canvasRenderers.build.clearAndRedraw();
              this.canvasRenderers.minimap.clearAndRedraw();
            }
            return;
          default:
            return;
        }

      },
      (start: GridPoint, end: GridPoint, isIntermediate: boolean) => {
        const points = this.grid.rotateGrid(this.grid.subArray(start, end, this.grid.gridPoints));

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
        }
      },
      () => {
        return store.getState().gameControls.value.highlightType === "cell";
      }
    );

    this.canvasRenderers = {
      grid: new RenderGridCanvas(this.canvases.canvasGrid, this.grid),
      base: new RenderBaseCanvas(this.canvases.canvasBase, this.grid),
      build: new RenderBuildCanvas(this.canvases.canvasBuild, this.grid),
      buildTemp: new RenderBuildCanvas(this.canvases.canvasBuildTemp, this.grid),
      hover: new RenderHoverCanvas(this.canvases.canvasHover, this.grid),
      debug: new RenderDebugCanvas(this.canvases.debug, this.grid, {width: this.canvasStage.clientWidth, height: this.canvasStage.clientHeight}),
      minimap: new RenderMinimapCanvas(this.canvases.minimap, this.grid),
    };
  }

  private centreScreen() {
    const canvasDimensions = this.grid.isometric.minDimensions();
    const centredOffsetLeft = (this.canvasStage.clientWidth / 2) - (canvasDimensions.width / 2);
    const centredOffsetTop = (this.canvasStage.clientHeight / 2) - (canvasDimensions.height / 2);
    this.moveScreenHandler.setScreenPosition({x: centredOffsetLeft, y: centredOffsetTop});
  }

  /**
   * Hopefully something outside this can use this to grab the entire canvas container,
   * and then put it wherever it wants.
   * @returns
   */
  public element() {
    return this.canvasStage;
  }

  public minimap() {
    return this.minimapElement;
  }

  /**
   * reset everything and draw everything.
   */
  public redraw() {
    console.log('called redraw');
    Object.values(this.canvasRenderers).forEach(r => r.clearAndRedraw());
  }

  private handlePointClicked(points: GridPoint[], firstCellHeight: number) {
    const actionType = store.getState().gameControls.value.clickAction;

    switch (actionType) {
      case "raise":
      case "lower":
        // if the user selects a lot of points, make all of those points the same height as the first on.
        const makeAllSameHeight = points.length > 1;
        if (makeAllSameHeight) {
          const height = firstCellHeight ?? 0;
          points.forEach((point) => point.setHeight(height));
        } else if (actionType === "raise" || actionType === "lower") {
          // we're adjusting just one point, so just adjust it.
          points[0]?.adjustHeight(actionType);
        }
        this.redraw();
        return;
      default:
        return;
    }
  }

  private setHoveredCell(x: number, y: number) {
    const closestCell = this.grid.closestCell(x, y);
    if (
      !closestCell
      || (
        // check if this hovered cell event is the same as the last hovered cell
        // if it is, then we don't need to do anything new.
        this.hoveredCell?.x === closestCell.x &&
        this.hoveredCell.y === closestCell.y
      )
    ) {
      return;
    }

    // keep track of the currently hovered cell. This is to avoid avoid unnecessary re-renders
    this.hoveredCell = closestCell;
    this.canvasRenderers.hover.drawCells([closestCell]);
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
      this.canvasRenderers.hover.clear();
      // this.canvases.canvasHover.clear();
      // this.canvasRenderers.hover.
      this.hoveredPoint &&
        this.canvases.canvasHover.draw.drawPoint(this.hoveredPoint);
    }
  }
  private mouseHoverHandler(x: number, y: number) {
    store.getState().gameControls.value.highlightType === "cell"
      ? this.setHoveredCell(x, y)
      : this.setHoveredPoint(x, y);
  }
}
