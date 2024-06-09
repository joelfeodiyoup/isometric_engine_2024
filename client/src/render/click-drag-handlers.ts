import { store } from "../state/app/store";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { Coords } from "./isometric";

type ClickHandlerArguments = {
  screenX: number,
  screenY: number,
  offsetX: number,
  offsetY: number,
  clickType: "right" | "left"
}
/**
 * function signature for handling clicks.
 */
type ClickHandlerFunction = (args: ClickHandlerArguments) => void;

abstract class ClickAndDragHandler {
  private isDragging = false;
  constructor(
    element: HTMLElement
  ) {
    element.addEventListener("mousedown", event => {
      this.isDragging = true;
      this.handleClick(this.onStartClick.bind(this), event);
    });
    // element.onmousedown
    element.addEventListener("mousemove", event => {
      if (this.isDragging) {
        this.onMidClick && this.handleClick(this.onMidClick.bind(this), event);
      }
    })
    element.addEventListener("mouseup", event => {
      this.isDragging = false;
      this.handleClick(this.onEndClick.bind(this), event);
    })
  }
  abstract onStartClick(args: ClickHandlerArguments): void;
  abstract onEndClick(args: ClickHandlerArguments): void;
  abstract onMidClick(args: ClickHandlerArguments): void;

  private handleClick(f: ClickHandlerFunction, event: MouseEvent) {
    f({
      screenX: event.screenX,
      offsetX: event.offsetX,
      screenY: event.screenY,
      offsetY: event.offsetY,
      clickType: this.clickType(event)});
    // f({screenX: event.clientX, screenY: event.clientY, clickType: this.clickType(event)});
  }

  private clickType(event: MouseEvent) {
    return event.button === 2 ? "right" : "left";
  }
}

/**
 * This abstracts the handling of moving the screen around by clicking and holding right click.
 * When the user does that I need to do some calculations from the original position and the new position
 */
export class MoveScreenHandler extends ClickAndDragHandler {
  private originClickPosition = null as null | Coords;
  public offset: {x: number, y: number} = {x: 0, y: 0};

  /** if the midpoint of the screen is exactly in the middle of canvas, then this is 0.5, 0.5.
   * or if the grid is off to the right of screen, then this would be something like -1, 0.5
   * Keeping track of this allows zooming etc.
   */
  private midpointOnCanvas = {x: 0.5, y: 0.5};
  constructor(
    element: HTMLElement,
    private originElementPosition: {x: number, y: number} = {x: 0, y: 0},
    private setPosition: ({x, y}: {x: number, y: number}) => void,
    private canvasSize: {width: number, height: number},
    private containerDimensions: {width: number, height: number},
  ) {
    super(element);
    this.updatePosition(originElementPosition);
  }
  public setScreenPosition(position?: {x: number, y: number}) {
    this.updatePosition(position);
  }
  private updatePosition(newPosition?: {x: number, y: number}) {
    this.offset = newPosition ?? this.offset;
    const scaledPosition = {x: this.offset.x, y: this.offset.y};
    this.updateMidpointRatio();
    this.setPosition(scaledPosition);
  }

  private updateMidpointRatio() {
    this.midpointOnCanvas = {
      x: ((this.containerDimensions.width / 2) - this.offset.x) / this.canvasSize.width,
      y: ((this.containerDimensions.height / 2) - this.offset.y) / this.canvasSize.height,
    };
  }

  /**
   * On zoom, basically the left/top offset values need to be recalculated.
   * This is essentially because now the canvases have a changed width/height dimension
   * @param updatedCanvasDimensions 
   */
  onZoom(updatedCanvasDimensions: DOMRect) {
    this.canvasSize = updatedCanvasDimensions;

    /**
     * For the offset, take the midpoint of the viewable screen (the container midpoint),
     * then subtract the ratio of the canvas that should exist at this point.
     */
    const offset = {
      x: (this.containerDimensions.width / 2) - this.midpointOnCanvas.x * this.canvasSize.width,
      y: (this.containerDimensions.height / 2) - this.midpointOnCanvas.y * this.canvasSize.height,
    };
    this.updatePosition(offset);
  }


  onStartClick(args: ClickHandlerArguments): void {
    if (args.clickType !== "right") {
      return;
    }
    this.originClickPosition = {x: args.screenX, y: args.screenY};
    this.originElementPosition.x = this.offset.x;
    this.originElementPosition.y = this.offset.y;
  }
  onEndClick(args: ClickHandlerArguments): void {
    if (args.clickType !== "right") {
      return;
    }
    const totalMoveAmount = this.inProgressMoveAmount(args.screenX, args.screenY);
    this.originElementPosition.x = this.originElementPosition.x - totalMoveAmount.x;
    this.originElementPosition.y = this.originElementPosition.y - totalMoveAmount.y;

    this.originClickPosition = null;
    this.updatePosition(this.originElementPosition);
  }

  onMidClick(args: ClickHandlerArguments): void {
    if (!this.originClickPosition) { return; }
    const moveAmount = this.inProgressMoveAmount(args.screenX, args.screenY);
    const newPosition = {x: this.originElementPosition.x - moveAmount.x, y: this.originElementPosition.y - moveAmount.y};
    this.updatePosition(newPosition);
  }

  /**
   * how much has the screen moved so far, without finalising the move
   * @param x 
   * @param y 
   */
  private inProgressMoveAmount(x: number, y: number): Coords {
    if (this.originClickPosition) {
      return {
        x: -1 * (x - this.originClickPosition.x),
        y: -1 * (y - this.originClickPosition.y)
      }
    } else {
      // I think this should be something...
      return {x, y}
    }
  }
}

export class SelectMultipleCells extends ClickAndDragHandler {
  private start: Coords | null = null;
  private end: Coords | null = null;

  constructor(
    element: HTMLElement,
    private convertScreenCoordsToCell: (coords: Coords) => (GridCell | null),
    private convertScreenCoordsToPoint: (coords: Coords) => (GridPoint | null),
    private handleMultipleCellsSelected: (start: GridCell, end: GridCell, isIntermediate: boolean) => void,
    private handleMultiplePointsSelected: (start: GridPoint, end: GridPoint, isIntermediate: boolean) => void,
    private shouldSelectCell: () => boolean,
  ) {
    super(element);
  }
  onStartClick(args: ClickHandlerArguments): void {
    if (args.clickType === "left") {
      this.start = {x: args.offsetX, y: args.offsetY};
    } else {
      this.start = null;
    }
  }
  onEndClick(args: ClickHandlerArguments): void {
    this.calculateStartEndRange(args);
  }
  onMidClick(args: ClickHandlerArguments): void {
    const {start, end} = this.calculateStartEndRange(args, true);
    // start && end && this.handleMultipleCellsSelected(start, end, isIntermediate);
  }

  /**
   * I want to display some stuff when the user is still dragging
   * So the "end" and "mid" events will do about the same thing.
   * @param args 
   * @returns 
   */
  calculateStartEndRange(args: ClickHandlerArguments, isIntermediate = false): {start: GridCell | GridPoint | null, end: GridCell | GridPoint | null} {
    if (args.clickType !== "left") {
      return {start: null, end: null};
    }
    this.end = {x: args.offsetX, y: args.offsetY};
    
    if (!this.start || !this.end) {
      return {start: null, end: null};
    }

    if (this.shouldSelectCell()) {
      const start = this.convertScreenCoordsToCell(this.start);
      const end = this.convertScreenCoordsToCell(this.end);
      if (!this.lastEndingPoint) { this.lastEndingPoint = end?.topLeft ?? null; }
      if (
        start && end && 
        (this.isNewEndingPoint(end.topLeft) || !isIntermediate)
      ) {
        this.lastEndingPoint = end.topLeft;
        this.handleMultipleCellsSelected(start, end, isIntermediate);
      } 
      return {start, end};
    } else {
      const start = this.convertScreenCoordsToPoint(this.start);
      const end = this.convertScreenCoordsToPoint(this.end);
      if (!this.lastEndingPoint) { this.lastEndingPoint = end; }
      if (
        start && end && 
        (this.isNewEndingPoint(end) || !isIntermediate)
      ) {
        this.lastEndingPoint = end;
        this.handleMultiplePointsSelected(start, end, isIntermediate);
      }
      return {start, end};
    }
  }
  private lastEndingPoint: GridPoint | null = null;
  private isNewEndingPoint(end: GridPoint) {
    return !(this.lastEndingPoint?.x === end.x && this.lastEndingPoint.y === end.y);
  }

}