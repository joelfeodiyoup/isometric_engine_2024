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
  constructor(
    element: HTMLElement,
    private originElementPosition: {x: number, y: number} = {x: 0, y: 0},
    private setPosition: ({x, y}: {x: number, y: number}) => void
  ) {
    super(element);
  }
  onStartClick(args: ClickHandlerArguments): void {
    if (args.clickType !== "right") {
      return;
    }
    this.originClickPosition = {x: args.screenX, y: args.screenY};
  }
  onEndClick(args: ClickHandlerArguments): void {
    if (args.clickType !== "right") {
      return;
    }
    const totalMoveAmount = this.inProgressMoveAmount(args.screenX, args.screenY);
    this.originElementPosition.x = this.originElementPosition.x - totalMoveAmount.x;
    this.originElementPosition.y = this.originElementPosition.y - totalMoveAmount.y;
    this.originClickPosition = null;
    this.setPosition(this.originElementPosition);
  }
  onMidClick(args: ClickHandlerArguments): void {
    if (!this.originClickPosition) { return; }
    const moveAmount = this.inProgressMoveAmount(args.screenX, args.screenY);
    const newPosition = {x: this.originElementPosition.x - moveAmount.x, y: this.originElementPosition.y - moveAmount.y};
    this.setPosition(newPosition);
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
    this.calculateStartEndRange(args, true);
  }

  /**
   * I want to display some stuff when the user is still dragging
   * So the "end" and "mid" events will do about the same thing.
   * @param args 
   * @returns 
   */
  calculateStartEndRange(args: ClickHandlerArguments, isIntermediate = false) {
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
      // return {start: start, end : end};
      start && end && this.handleMultipleCellsSelected(start, end, isIntermediate);
    } else {
      const start = this.convertScreenCoordsToPoint(this.start);
      const end = this.convertScreenCoordsToPoint(this.end);
      // return {start: start, end: end};
      start && end && this.handleMultiplePointsSelected(start, end, isIntermediate);
    }
  }

}