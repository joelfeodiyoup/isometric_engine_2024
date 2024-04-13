import { Colors } from "./draw";
import { Coords } from "./isometric";

export abstract class Canvas {
  protected abstract ctx: CanvasRenderingContext2D;
  
  constructor(
    onClick: (x: number, y: number) => void,
    onMouseMove: (x: number, y: number) => void,
    private screen: Coords = {x: 0, y: 0}
  ) {
  }

  drawLine(from: Coords, to: Coords) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.translateX(from.x), this.translateY(from.y));
    this.ctx.moveTo(this.translateX(from.x), this.translateY(from.y));
    this.ctx.lineTo(this.translateX(to.x), this.translateY(to.y));
    this.ctx.stroke();
  }

  drawFilledPolygon(points: Coords[], color: Colors) {
    
    const region = new Path2D();
    points[0] && region.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => {
      region.lineTo(p.x, p.y);
    });
    region.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill(region);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  moveScreen(x: number, y: number) {
    this.screen.x += x;
    this.screen.y += y;
  }

  private translateX(x: number) {
    return x + this.screen.x;
  }
  private translateY(y: number) {
    return y + this.screen.y;
  }
}

export class CanvasHover extends Canvas {
  protected ctx: CanvasRenderingContext2D;
  constructor(onClick: (x: number, y: number) => void,
  onMouseMove: (x: number, y: number) => void,
  ) {
    super(onClick, onMouseMove);
    const canvas = <HTMLCanvasElement>document.getElementById("canvas-hover");

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("couldn't find context for canvas");
    }
    this.ctx = ctx;

    canvas.onclick = (event) => {
      onClick(event.offsetX, event.offsetY);
    }
    canvas.onmousemove = (event) => {
      onMouseMove(event.offsetX, event.offsetY);
    }
  }
}
export class CanvasGrid extends Canvas {
  protected ctx: CanvasRenderingContext2D;
  constructor(onClick: (x: number, y: number) => void,
  onMouseMove: (x: number, y: number) => void,
  ) {
    super(onClick, onMouseMove);
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("couldn't find context for canvas");
    }
    this.ctx = ctx;
  }
}