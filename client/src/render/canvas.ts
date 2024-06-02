import { Colors, Draw } from "./draw";
import { Coords } from "./isometric";

import road from "./../images/road.png";
import tree_01 from "./../images/trees/tree_01.png";
import tree_02 from "./../images/trees/tree_02.png";
import tree_03 from "./../images/trees/tree_03.png";
import tree_04 from "./../images/trees/tree_04.png";
import { store } from "../state/app/store";

export type ImageSource = {path: string, width: number, height: number};
export type LoadedImage = {
  element: HTMLImageElement,
  width: number,
  height: number,
}
export class Canvas {
  protected ctx: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  public draw: Draw;
  
  constructor(
    canvas: HTMLCanvasElement,
  ) {
    // This is a bit of a timing issue that'll arrive sometime.
    // When this class gets initialised, I load the assets to begin with.
    // this is because the assets function doesn't really handle multiple things all trying to load the same image at the same time.
    // If that happens, the others get stuck.
    // So instead, load everythin initially.
    // Not really ideal. I need to look into this.
    this.initAssetsLoad();

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("couldn't find context for canvas");
    }
    this.canvas = canvas;
    this.ctx = ctx;
    this.draw = new Draw(this);
  }

  private initAssetsLoad() {
    assets.load([
      {path: tree_01, width: 70, height: 100},
      {path: tree_02, width: 90, height: 140},
      {path: tree_03, width: 90, height: 140},
      {path: tree_04, width: 90, height: 140},
    ]);
  }

  public setListeners(
    {onClick, onMouseMove}: {
      onClick?: (x: number, y: number) => void,
      onMouseMove?: (x: number, y: number) => void
    }
  ) {
    if (onClick) {
      this.canvas.onclick = (event) => {
        onClick(event.offsetX, event.offsetY);
        // onClick(this.position.x + event.offsetX, this.position.y + event.offsetY);
      }
    }
    if (onMouseMove) {
      this.canvas.onmousemove = (event) => {
        // onMouseMove(this.position.x + event.offsetX, this.position.y + event.offsetY);
        onMouseMove(event.offsetX, event.offsetY);
      }
    }
  }

  drawLine(from: Coords, to: Coords, color: Colors = "black") {
    this.ctx.beginPath();
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

  static get randomTree(): LoadedImage {
    const len = Object.values(assets.loadedAsset.images).length;
    return Object.values(assets.loadedAsset.images)[Math.floor(Math.random() * len)];
  }

  drawImage(center: Coords, src: LoadedImage) {
    const zoom = store.getState().gameControls.value.zoomLevel;
    const multiplier = zoom / 4;
    // assets.load([`${tree_01}`]).then((img) => {
      // const img = assets.loadedAsset.images[tree_01];
      const img = src;
      // const width = 70; // todo: this should be the cell width, probably
      // const height = 100; // todo: this should be the actual image width, but scaled according to cell width, etc.
      const width = img.width * multiplier; // todo: this should be the cell width, probably
      const height = img.height * multiplier; // todo: this should be the actual image width, but scaled according to cell width, etc.
      
      // The actual bottom midpoint of the image will be somewhere slightly above the bottom of the image.
      // just due to how the tree (or whatever) would be drawn.
      // I should ideally record this in some meta file for each image.
      // I'll work on that...
      const offsetOfImageAboveCenter = 7;

      // canvas takes the top left coordinate to draw from.
      // So the height of the image needs to be subtracted from the y coordinate to find this y point.
      this.ctx.drawImage(img.element!, center.x - (width / 2), center.y - height + offsetOfImageAboveCenter, width, height);
    // })
  }

  private translateX(x: number) {
    // return x + this.position.x;
    return x;
  }
  private translateY(y: number) {
    // return y + this.position.y;
    return y;
  }

  public drawPixels<T extends {x: number, y: number}>(cells: T[], color: (cell: T) => {red: number, green: number, blue: number}) {
    const ctx = this.canvas.getContext('2d')!;
    const imageData = ctx.createImageData(this.canvas.width, this.canvas.height);
    const data = imageData.data;
    for(let i = 0; i < (this.canvas.width * this.canvas.height * 4); i+=4) {
      const c = color(cells[i / 4]);
      data[i + 0 ] = c.red;
      data[i + 1 ] = c.green;
      data[i + 2 ] = c.blue;
      data[i + 3 ] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }
}

/**
 * This handles loading up an array of images to be used later.
 */
const assets = {
  toLoad: 0,
  loaded: 0,
  loadedAsset: {
    images: {} as {[key in string]: LoadedImage}
  },
  imageExtensions: ["png", "jpg", "gif"],
  load(sources: ImageSource[]) {
    return new Promise<HTMLImageElement>(resolve => {
      let loadHandler = (image: HTMLImageElement) => {
        this.loaded += 1;

        //Check whether everything has loaded
        if (this.toLoad === this.loaded) {

          //Reset `toLoad` and `loaded` to `0` so you can use them
          //to load more assets later if you need to
          this.toLoad = 0;
          this.loaded = 0;      

          //Resolve the promise
          resolve(image);
        } 
      }
      this.toLoad = sources.length;
      sources.forEach(source => {
        let extension = source.path.split(".").pop() ?? "";
        if (this.imageExtensions.indexOf(extension) !== -1) {
          this.loadImage(source, loadHandler);
        }
      })
    })
  },
  loadImage(source: ImageSource, loadHandler: (image: HTMLImageElement) => void) {
    // if (!this.loadedAsset.images[source]) { 
      let image = new Image();
      image.addEventListener("load", () => loadHandler(image), false);
      // image.addEventListener("load", loadHandler(image), false);
      this.loadedAsset.images[source.path] = {
        element: image,
        width: source.width,
        height: source.height,
      };
      image.src = source.path;
    // } else {
    //   loadHandler();
    // }
  }
}