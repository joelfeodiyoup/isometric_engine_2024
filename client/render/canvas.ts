import { Colors, Draw } from "./draw";
import { Coords } from "./isometric";

export class Canvas {
  protected ctx: CanvasRenderingContext2D;
  protected canvas: HTMLCanvasElement;
  public draw: Draw;
  
  constructor(
    canvasElementId: string
  ) {
    const canvas = <HTMLCanvasElement>document.getElementById(canvasElementId);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("couldn't find context for canvas");
    }
    this.canvas = canvas;
    this.ctx = ctx;
    this.draw = new Draw(this);
  }

  protected setListeners(
    onClick: (x: number, y: number) => void,
    onMouseMove: (x: number, y: number) => void
  ) {
    this.canvas.onclick = (event) => {
      onClick(event.offsetX, event.offsetY);
      // onClick(this.position.x + event.offsetX, this.position.y + event.offsetY);
    }
    this.canvas.onmousemove = (event) => {
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
    assets.load(["./../images/road.png"]).then((img) => {
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

/**
 * Only some of the canvases need to have a click handler on them.
 */
export class CanvasWithMouseLiseners extends Canvas {
  constructor(
    domElementId: string,
    onClick: (x: number, y: number) => void,
    onMouseMove: (x: number, y: number) => void,
  ) {
    super(domElementId);
    super.setListeners(onClick, onMouseMove);
  }
}

/**
 * This handles loading up an array of images to be used later.
 */
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