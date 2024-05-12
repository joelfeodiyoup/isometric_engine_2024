import { Coords } from "./isometric";

type ClickHandlerArguments = {
  screenX: number,
  screenY: number,
  clickType: "right" | "left"
}
/**
 * function signature for handling clicks.
 */
type ClickHandlerFunction = (args: ClickHandlerArguments) => void;

abstract class ClickAndDragHandler {
  constructor(
    element: HTMLElement
  ) {
    element.addEventListener("mousedown", event => {
      this.handleClick(this.onStartClick.bind(this), event);
    });
    element.addEventListener("mousemove", event => {
      this.onMidClick && this.handleClick(this.onMidClick.bind(this), event);
    })
    element.addEventListener("mouseup", event => {
      this.handleClick(this.onEndClick.bind(this), event);
    })
  }
  abstract onStartClick(args: ClickHandlerArguments): void;
  abstract onEndClick(args: ClickHandlerArguments): void;
  abstract onMidClick?(args: ClickHandlerArguments): void;

  private handleClick(f: ClickHandlerFunction, event: MouseEvent) {
    f({screenX: event.clientX, screenY: event.clientY, clickType: this.clickType(event)});
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
    this.originClickPosition = {x: args.screenX, y: args.screenY};
  }
  onEndClick(args: ClickHandlerArguments): void {
    const totalMoveAmount = this.inProgressMoveAmount(args.screenX, args.screenY);
    this.originElementPosition.x = this.originElementPosition.x - totalMoveAmount.x;
    this.originElementPosition.y = this.originElementPosition.y - totalMoveAmount.y;
    this.originClickPosition = null;
    this.setPosition(this.originElementPosition);
  }
  onMidClick?(args: ClickHandlerArguments): void {
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