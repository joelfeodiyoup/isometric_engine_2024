import { Colors } from "./draw";
import { Coords } from "./isometric";
import { ScreenPosition } from "./screen-position";

export abstract class Canvas {
  protected ctx: CanvasRenderingContext2D;
  protected canvas: HTMLCanvasElement;
  
  constructor(
    // private position: ScreenPosition
    canvasElementId: string
  ) {
    const canvas = <HTMLCanvasElement>document.getElementById(canvasElementId);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("couldn't find context for canvas");
    }
    this.canvas = canvas;
    this.ctx = ctx;
  }

  protected setListeners(
    canvas: HTMLCanvasElement,
    onClick: (x: number, y: number) => void,
    onMouseMove: (x: number, y: number) => void
  ) {
    canvas.onclick = (event) => {
      onClick(event.offsetX, event.offsetY);
      // onClick(this.position.x + event.offsetX, this.position.y + event.offsetY);
    }
    canvas.onmousemove = (event) => {
      // onMouseMove(this.position.x + event.offsetX, this.position.y + event.offsetY);
      onMouseMove(event.offsetX, event.offsetY);
    }
  }

  drawLine(from: Coords, to: Coords, color: Colors = "black") {
    this.ctx.beginPath();
    this.ctx.moveTo(this.translateX(from.x), this.translateY(from.y));
    this.ctx.moveTo(this.translateX(from.x), this.translateY(from.y));
    this.ctx.lineTo(this.translateX(to.x), this.translateY(to.y));
    this.ctx.strokeStyle = color;
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
    this.ctx.strokeStyle = "white";
    this.ctx.stroke();
    this.ctx.fillStyle = "white";
    this.ctx.fill();
  }

  drawImage(topLeft: Coords, bottomRight: Coords, index: number) {
    assets.load(["road.png"]).then((img) => {
      // const img = assets.loadedAsset.images["road.png"];
      // img!.id = "hello-fool";
      // console.log(img);
      // document.body.appendChild(img!);
      const width = bottomRight.x - topLeft.x;
      const height = bottomRight.y - topLeft.y;
      console.log(`width: ${width} height: ${height}`)
      this.ctx.drawImage(img!, topLeft.x, topLeft.y, width, height);
      console.log(index);
    })
  }

  private translateX(x: number) {
    // return x + this.position.x;
    return x;
  }
  private translateY(y: number) {
    // return y + this.position.y;
    return y;
  }
}

export class CanvasHover extends Canvas {
  // protected ctx: CanvasRenderingContext2D;
  constructor(
    origin: ScreenPosition,
    onClick: (x: number, y: number) => void,
    onMouseMove: (x: number, y: number) => void,
  ) {
    super("canvas-hover");
    super.setListeners(this.canvas, onClick, onMouseMove);
  }
}
export class CanvasGrid extends Canvas {
  constructor(
  ) {
    super("canvas");
  }
}

const assets = {
  toLoad: 0,
  loaded: 0,
  loadedAsset: {
    images: {} as {[key in string]: HTMLImageElement}
  },
  imageExtensions: ["png", "jpg", "gif"],
  load(sources: string[]) {
    return new Promise<HTMLImageElement>(resolve => {
      let loadHandler = (image: HTMLImageElement) => {
        this.loaded += 1;
        console.log(this.loaded);

        //Check whether everything has loaded
        if (this.toLoad === this.loaded) {

          //Reset `toLoad` and `loaded` to `0` so you can use them
          //to load more assets later if you need to
          this.toLoad = 0;
          this.loaded = 0;      
          console.log("Assets finished loading");

          //Resolve the promise
          resolve(image);
        } 
      }
      this.toLoad = sources.length;
      sources.forEach(source => {
        let extension = source.split(".").pop() ?? "";
        if (this.imageExtensions.indexOf(extension) !== -1) {
          this.loadImage(source, loadHandler);
        }
      })
    })
  },
  loadImage(source: string, loadHandler: (image: HTMLImageElement) => void) {
    // if (!this.loadedAsset.images[source]) { 
      let image = new Image();
      image.addEventListener("load", () => loadHandler(image), false);
      // image.addEventListener("load", loadHandler(image), false);
      this.loadedAsset.images[source] = image;
      image.src = source;
    // } else {
    //   loadHandler();
    // }
  }
}