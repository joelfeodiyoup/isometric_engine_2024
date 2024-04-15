import { Coords } from "./isometric";

class ContainerContext {
  constructor() {}
}

/**
 * handle scrolling of the screen
 */
export class ScreenPosition {
  private originClickPosition = null as null | Coords;

  public get x() {
    return this.originElementPosition.x;
  }
  public get y() {
    return this.originElementPosition.y;
  }

  constructor(
    private originElementPosition: {x: number, y: number} = {x: 0, y: 0},
    private setPosition: ({x, y}: {x: number, y: number}) => void
  ) {}

  public startScroll(x: number, y: number) {
    this.originElementPosition.x = x;
    this.originElementPosition.y = y;
  }

  public endScroll(x: number, y: number) {
    const totalMoveAmount = this.inProgressMoveAmount(x, y);
    this.originElementPosition.x = this.originElementPosition.x - totalMoveAmount.x;
    this.originElementPosition.y = this.originElementPosition.y - totalMoveAmount.y;
    this.originClickPosition = null;
    this.setPosition(this.originElementPosition);
  }

  public midScroll(x: number, y: number) {
    const moveAmount = this.inProgressMoveAmount(x, y);
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
        x: x - this.originClickPosition.x,
        y: y - this.originClickPosition.y
      }
    } else {
      // I think this should be something...
      return {x, y}
    }
  }

}