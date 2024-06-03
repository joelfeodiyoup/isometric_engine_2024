import { store } from "../state/app/store";
import { Grid } from "./grid";
import { Coords, Isometric } from "./isometric";

/**
 * Represents a point on the map.
 * Each point has a single height.
 * Four points would make a cell, which will be represented by another object
 */
export class GridPoint {
  /** the col number for this point */
  public get x() {
    return this.xyAtRotation[this.rotation].x;
  }
  /** The row number for this point */
  public get y() {
    return this.xyAtRotation[this.rotation].y;
  }
  private get xyAtRotation() {
    const x = [this._x, this._y, this.dimensions.width - this._x, this.dimensions.height - this._y];
    return x.map((_, i) => ({x: x[i], y: x[(i + 1) % 4]}));
  }

  /** store coordinates of for all the rotations of this point.
   * Later, these could just be looked up with an index for the rotation.
   */
  private baseCoordsAtRotation;
  private calculateBaseCoordsAtRotation() {
    return this.xyAtRotation.map(xy => this.isometric.coords(xy.x, xy.y));
  }

  /** get the coordinates for any rotation direction for this point. */
  public coordsAtRotation(rotationDirection: "north" | "east" | "south" | "west") {
    const d = {north: 0, east: 1, south: 2, west: 3};
    const baseCoords = this.baseCoordsAtRotation[d[rotationDirection]];
    return {x: baseCoords.x, y: baseCoords.y - this.scaledHeight};
  }
  /** The screen coordinates for this point, without taking into account the vertical height */
  // public readonly baseCoords: Coords;
  public get baseCoords(): Coords {
    return this.baseCoordsAtRotation[this.rotation];
  }

  public calculateSubTerrainPoint(): Coords {
    const subTerrainDepth = 70;
    return {x: this.baseCoords.x * this.zoomMultiplier, y: (this.baseCoords.y + subTerrainDepth) * this.zoomMultiplier};
  }

  private get rotation() {
    return store.getState().gameControls.value.rotation;
  }
  private get zoomMultiplier() {
    const zoom = store.getState().gameControls.value.zoomLevel;

    // rather than do some weird mathematical formula mapping (which I might do some time), I'll just have a look up table.
    // 'zoom' will act as the index, and then the value found there is the zoom multipler.
    // index '4' should keep the zoom just the same.
    const zoomMultiplierMapping = [0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16];
    return zoomMultiplierMapping[zoom] ?? 1;
  }
  private get dimensions() {
    return store.getState().gameState.value.dimensions;
  }
  public get coords(): Coords {
    return {x: this.baseCoords.x * this.zoomMultiplier, y: (this.baseCoords.y - this.scaledHeight) * this.zoomMultiplier}
  }

  public height;

  private get heightMultiplier() {
    // the scaling of the height levels should be related to the isometric sizing
    return this.isometric.xStep * 0.1;
  }

  private get scaledHeight() {
    return this.heightMultiplier * this.height;
  }

  constructor(
    private _x: number,
    private _y: number,
    private isometric: Isometric, 
    height?: number
  ) {
    this.height = height ?? Math.round(Math.random() * 1 - 0);
    this.baseCoordsAtRotation = this.calculateBaseCoordsAtRotation();
  }

  /**
   * This basically should get called just once on initialisation
   * The problem is that the neighbouring grid points might not yet have been initialised
   * So for that reason I've put this in a function to be called later. It's a bit clunky though.
   * @param grid 
   * @returns 
   */
  public neighbours(grid: GridPoint[][]) {
    return {
      north: grid[this._y - 1]?.[this._x] ?? null,
      east: grid[this._y]?.[this._x + 1] ?? null,
      south: grid[this._y + 1]?.[this._x] ?? null,
      west: grid[this._y]?.[this._x - 1] ?? null,
    }
  }


  public adjustHeight(direction: 'raise' | 'lower') {
    // * 10 because of the perlin noise. I need to figure out what this should really be...
    const newHeight = this.height + (direction === "raise" ? 1 : -1) * 10 ;
    this.setHeight(newHeight);
  }
  
  public setHeight(height: number) {
    this.height = height;
    this.coords.y = this.baseCoords.y + this.scaledHeight;
  }

  public distanceToPoint(point: Coords) {
    return Math.sqrt((point.x - this.coords.x) ** 2 + (point.y - this.coords.y) ** 2);
  }
}