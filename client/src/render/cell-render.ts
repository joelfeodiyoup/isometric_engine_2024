import { store } from "../state/app/store";
import { GridPoint } from "./grid-point";

type RotationDirection = "north" | "east" | "south" | "west";
type WorldPoint = "north" | "east" | "south" | "west";
type ScreenPoint = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";

/**
 * Rendering of cells is starting to get a little complicated
 * I want things outside of cells to not need to worry about any details.
 * So this class will hopefully abstract enough of that.
 * I also hope to improve some efficiency by keeping some confusing details hidden in here.
 * E.g. I think that less recalculations could be done.
 * 
 * Each cell is defined by four points.
 * These can be represented in two ways:
 *  1. the compass side it faces (e.g. on the north side)
 *  2 the point at the "top left" of the view.
 * 
 * (1) could appear in different spots, according to how the view is rotated, but it's still the "same" cell, just with different view coordinates
 * (2) will refer to a different cell, according to rotation of the screen.
 * 
 * This distinction is important, and will help in keeping track of things.
 */
export class CellRender {
  public get polygonsForRendering() {
    return this.polygons.map(s => ({brightness: s.brightness, coords: Array.from(s.polygonSet).map(key => this.worldCorners[key].coords)}));
  }
  private polygons;
  constructor(
    private worldCorners: Record<WorldPoint, GridPoint>,
  ) {
    this.polygons = this.calculatePolygonSet();
  }

  /**
   * The corners as seen from the view perspective.
   * This changes according to rotation.
   */
  // private get corners(): {topLeft: Coords, topRight: Coords, bottomRight: Coords, bottomLeft: Coords} {
  //   const rotation = Rotation.currentSemanticRotation;
  //   const x = this.currentRotation[rotation];
  // }

  /**
   * Returns an object that maps current rotation direction to a set of topLeft, topRight, bottomRight, bottomLeft directions.
   * e.g. currentRotation["north"] will return {topLeft: "west", topRight: "north", bottomRight: "east", bottomLeft: "south"}
   * currentRotation["east"] will return {topLeft: "north", // etc... }
   */
  private get currentRotation(): Record<
    RotationDirection,
    Record<
      ScreenPoint,
      GridPoint
    >
  > {
    const rotation = store.getState().gameControls.value.rotation;
    const keys = ["north", "east", "south", "west"];
    const nDirections = 4;
    const viewLabels = ["topRight", "bottomRight", "bottomLeft", "topLeft"];
    const mapping = Object.fromEntries(keys.map((key, i) => {
      return [key, 
        Object.fromEntries(viewLabels.map((label, j) => {
          // we're mapping over directions, indexed by i.
          // i.e. north -> 0. east -> 1.
          // Each of these directings has a mapping of label to a direction.
          // i.e. when rotation view is north (i === 0), then "topRight" (j === 0) needs to point to north.
          return [label, this.worldCorners[(keys[(i + j) % nDirections]) as WorldPoint]];
        }))
      ]
    })) as Record<
      RotationDirection,
      Record<ScreenPoint, GridPoint>
    >;
    return mapping;
  }

  /**
   * To render the cell, a collection of polygons is needed.
   * This is because sometimes the cell needs to be drawn as two triangles.
   * Other times it can be drawn as one quadrilateral.
   * 
   * These polygons are actually the same in the "real world", but the camera just rotates around them.
   *  i.e. if the cells on west, north, east make up a polygon that needs to be rendered,
   *  then we can remember [west, north, east] as the set that needs a polygon rendering.
   *  Then I need to just choose the correct "view" points for this, according to the current rotation
   *  e.g. when the view is facing north, these points will make up [topLeft, topRight, bottomRight]
   *  when the view is facing east, these points will make up [bottomLeft, topLeft, topRight].
   */
  private calculatePolygonSet() {
    const polygons: Set<WorldPoint>[] = [];
    if (
      this.worldCorners.north.height === this.worldCorners.east.height
      && this.worldCorners.east.height === this.worldCorners.south.height
      && this.worldCorners.south.height === this.worldCorners.west.height
    ) {
      polygons.push(new Set(["north", "east", "south", "west"]));
    } else if (
      this.worldCorners.north.height === this.worldCorners.south.height
    ) {
      polygons.push(new Set(["north", "east", "south"]));
      polygons.push(new Set(["north", "south", "west"]));
    } else if (
      this.worldCorners.east.height === this.worldCorners.west.height
    ) {
      polygons.push(new Set(["north", "east", "west"]));
      polygons.push(new Set(["east", "south", "west"]));
    } else {
      polygons.push(new Set(["north", "east", "south", "west"]));
    }
    return polygons.map(set => ({polygonSet: set, brightness: this.calculateBrightnessOfPolygon(set)}));
  }

  /**
   * Given a set of point keys that define a polygon, calculate how bright this polygon should be.
   * @param polygonSet 
   * @returns 
   */
  private calculateBrightnessOfPolygon(polygonSet: Set<WorldPoint>): number {
    let brightness = 0;
    brightness += this.brightness("south", "west", polygonSet, 3);
    brightness += this.brightness("south", "east", polygonSet);
    brightness += this.brightness("east", "north", polygonSet, 3);
    brightness += this.brightness("west", "north", polygonSet);
    return brightness;
  }

  private brightness(keyA: WorldPoint, keyB: WorldPoint, set: Set<WorldPoint>, weighting = 1) {
    if (set.has(keyA) && set.has(keyB)) {
      const h1 = this.worldCorners[keyA].height;
      const h2 = this.worldCorners[keyB].height;
      return weighting * (h1 === h2 ? 0
        : h1 < h2 ? 1 : -1)
    } else {
      return 0;
    }
  }
}