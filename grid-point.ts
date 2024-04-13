import { Grid } from "./grid";
import { Coords, Isometric } from "./isometric";

/**
 * Represents a point on the map.
 * Each point has a single height.
 * Four points would make a cell, which will be represented by another object
 */
export class GridPoint {
  public readonly baseCoords: Coords;
  public readonly coords: Coords;
  protected height: number = 0;

  constructor(public x: number, public y: number,
    private isometric: Isometric) {
    this.baseCoords = this.isometric.coords(x, y);
    this.height = Math.floor(Math.random() * 2 - 2);
    if (x === 0 && y === 0) {
      this.height = 0;
    }
    this.coords = {x: this.baseCoords.x, y: this.baseCoords.y + this.height * -15};
  }
  public neighbours(grid: GridPoint[][]) {
    return {
      north: grid[this.y - 1]?.[this.x] ?? null,
      east: grid[this.y]?.[this.x + 1] ?? null,
      south: grid[this.y + 1]?.[this.x] ?? null,
      west: grid[this.y]?.[this.x - 1] ?? null,
    }
  }

  public increaseHeight() {
    this.height -= 1;
    this.coords.y = this.baseCoords.y + this.height * 15;
    console.log(this);
  }
}