import { Colors } from "./draw";
import { OriginPosition } from "./game";
import { Coords } from "./isometric";

export abstract class Canvas {
  protected abstract ctx: CanvasRenderingContext2D;
  
  constructor(
    private position: OriginPosition
  ) {
  }

  protected setListeners(
    canvas: HTMLCanvasElement,
    onClick: (x: number, y: number) => void,
    onMouseMove: (x: number, y: number) => void
  ) {
    canvas.onclick = (event) => {
      onClick(this.position.x + event.offsetX, this.position.y + event.offsetY);
    }
    canvas.onmousemove = (event) => {
      onMouseMove(this.position.x + event.offsetX, this.position.y + event.offsetY);
    }
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

  drawPoint(point: Coords) {
    this.ctx.beginPath();
    const radius = 5;
    this.ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    // this.ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fillStyle = "black";
    this.ctx.fill();
  }

  private translateX(x: number) {
    return x + this.position.x;
  }
  private translateY(y: number) {
    return y + this.position.y;
  }
}

export class CanvasHover extends Canvas {
  protected ctx: CanvasRenderingContext2D;
  constructor(
    origin: OriginPosition,
    onClick: (x: number, y: number) => void,
    onMouseMove: (x: number, y: number) => void,
  ) {
    super(origin);
    const canvas = <HTMLCanvasElement>document.getElementById("canvas-hover");

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("couldn't find context for canvas");
    }
    this.ctx = ctx;

    super.setListeners(canvas, onClick, onMouseMove);
  }
}
export class CanvasGrid extends Canvas {
  protected ctx: CanvasRenderingContext2D;
  constructor(
    origin: OriginPosition,
    onClick: (x: number, y: number) => void,
    onMouseMove: (x: number, y: number) => void,
  ) {
    super(origin);
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("couldn't find context for canvas");
    }
    this.ctx = ctx;
  }
}