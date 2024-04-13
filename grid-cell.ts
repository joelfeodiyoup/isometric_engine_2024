import { GridPoint } from "./grid-point";

/**
 * 
 */
export class GridCell {
  constructor(
    public readonly topLeft: GridPoint,
    public readonly topRight: GridPoint,
    public readonly bottomLeft: GridPoint,
    public readonly bottomRight: GridPoint,
  ) {}
}