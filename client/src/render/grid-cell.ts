import value from "perlin-noise";
import { store } from "../state/app/store";
import { Canvas, ImageSource, LoadedImage } from "./canvas";
import { GridPoint } from "./grid-point";
import { Coords } from "./isometric";
import { lineParameters } from "./utils/maths";

/**
 * Represents a rectangular area of the grid, defined by the points topLeft, topRight, etc.
 * Also contains some methods to check things about this. i.e. "is some point in the cell"
 */
export class GridCell {
  public isFilled = true;
  public avgHeight = 0;
  public polygons: {coords: Coords[], brightness: number}[] = [

  ];

  private recalculatePolygons() {
    let polygonHeights: {
      coords: Coords[];
      brightness: number;
    }[] = [];
    if (
      this.topLeft.height === this.topRight.height
      && this.topRight.height === this.bottomRight.height
      && this.bottomRight.height === this.bottomLeft.height
    ) {
      const p = {topRight: this.topRight, bottomRight: this.bottomRight, bottomLeft: this.bottomLeft, topLeft: this.topLeft};
      polygonHeights = [this.calculateBrightness(p)];
    } else if (this.topLeft.height === this.bottomRight.height) {
      const p1 = {topLeft: this.topLeft, bottomRight: this.bottomRight, bottomLeft: this.bottomLeft};
      const p2 = {topLeft: this.topLeft, topRight: this.topRight, bottomRight: this.bottomRight};
      
      polygonHeights = [p1, p2].map(x => this.calculateBrightness(x));
    } else if (this.topRight.height === this.bottomLeft.height) {
      const p1 = {topRight: this.topRight, bottomLeft: this.bottomLeft, bottomRight: this.bottomRight};
      const p2 = {topRight: this.topRight, bottomLeft: this.bottomLeft, topLeft: this.topLeft};
      
      polygonHeights = [p1, p2].map(x => this.calculateBrightness(x));
    } else {
      const p = {topRight: this.topRight, bottomRight: this.bottomRight, bottomLeft: this.bottomLeft, topLeft: this.topLeft};
      polygonHeights = [this.calculateBrightness(p)];
    }
    this.polygons = polygonHeights;
  }

  private calculateBrightness(points: {[key in "topLeft" | "topRight" | "bottomLeft" | "bottomRight"]?: GridPoint}) {
    let brightness = 0;
    brightness += this.brightness(points.bottomLeft, points.topLeft, 3);
    brightness += this.brightness(points.bottomLeft, points.bottomRight);
    brightness += this.brightness(points.bottomRight, points.topRight, 3);
    brightness += this.brightness(points.topLeft, points.topRight);
    return {coords: Object.values(points).map(x => x.coords), brightness}
  }
  // public color: string | null = "green";

  /**
   * color is calculated from the angle of the tile
   * This needs to be calculated only when the points change.
   */
  public get color() {
    let brightness = 0;
    // brightness += this.brightness(this.bottomLeft.height, this.topLeft.height, 2);
    // brightness += this.brightness(this.bottomLeft.height, this.bottomRight.height);
    // brightness += this.brightness(this.bottomRight.height, this.topRight.height, 2);
    // brightness += this.brightness(this.topLeft.height, this.topRight.height);
    return `hsl(90, ${0.5 * (80 + brightness * 5)}%, ${55 + brightness * 3}%)`;
    // return `hsl(120, ${80 + brightness * 5}%, ${25 + brightness * 5}%)`;
  }

  private brightness(southernHeight?: GridPoint, northernHeight?: GridPoint, weighting = 1) {
    if (!southernHeight || !northernHeight) { return 0; }
    return weighting * (southernHeight.height === northernHeight.height ? 0
      : southernHeight.height < northernHeight.height ? 1 : -1);
  }

  /**
   * Todo: find some way for each cell to say which image it should render.
   * Possibly it'll reference some other file which contains keys for images.
   * Not sure yet.
   */
  // public image: any;
  public hasImage: boolean = false;
  public imageSource = Canvas.randomTree;

  public setImage(src: LoadedImage) {
    this.imageSource = src;
  }

  public get cells(): GridPoint[] {
    return [...[this._topLeft, this._topRight, this._bottomRight, this._bottomLeft]];
  }
  public get rotation(): number {
    return store.getState().gameControls.value.rotation;
  }

  public get topLeft(): GridPoint {
    return this.cells[this.rotation % 4];
  }
  public get topRight(): GridPoint {
    return this.cells[(this.rotation + 1) % 4];
    // return this._topRight;
  }
  public get bottomLeft(): GridPoint {
    return this.cells[(this.rotation + 3) % 4];
    // return this._bottomLeft;
  }
  public get bottomRight(): GridPoint {
    return this.cells[(this.rotation + 2) % 4];
    // return this._bottomRight;
  }

  constructor(
    private _topLeft: GridPoint,
    private _topRight: GridPoint,
    private _bottomLeft: GridPoint,
    private _bottomRight: GridPoint,
    /** the col number for this cell */
    public readonly x: number,
    /** the row number for this cell */
    public readonly y: number,
  ) {
    this.avgHeight = (this.topLeft.height + this.topRight.height + this.bottomRight.height + this.bottomLeft.height) / 4;
    this.recalculatePolygons();
  }

  public isPointInsideCell(point: Coords): boolean {
    const topLine = lineParameters(this.topLeft.coords, this.topRight.coords);
    const bottomLine = lineParameters(this.bottomLeft.coords, this.bottomRight.coords);
    const leftLine = lineParameters(this.topLeft.coords, this.bottomLeft.coords);
    const rightLine = lineParameters(this.topRight.coords, this.bottomRight.coords);

    return !this.pointIsAboveLine(point, topLine) &&
      this.pointIsAboveLine(point, bottomLine) &&
      this.pointIsAboveLine(point, leftLine) &&
      !this.pointIsAboveLine(point, rightLine);
  }

    /**
   * given some line and a point, check if the point is above or below the line
   * @param x 
   * @param line 
   */
    private pointIsAboveLine(x: Coords, line: {a: number, b: number}): boolean {
      /**
       * The line has equation y = ax + b, with a and b known.
       * For this point (x, y), substitute in x, to see where y would be, for this x value, if it were on the line.
       * then this y value can be compared with the actual y value of the point.
       */
      const yOnLine = line.a * x.x + line.b;
      const isAboveLine = x.y <= yOnLine;
      return isAboveLine;
    }
}