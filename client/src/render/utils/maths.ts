import { Coords } from "../isometric";

export const rectangleMidPoint = (topLeft: Coords, topRight: Coords, bottomLeft: Coords, bottomRight: Coords): Coords => {
  let x: number;
  let y: number;
  let l2: ReturnType<typeof lineParameters>;
  
  const l1 = lineParameters(topLeft, bottomRight);

  // a vertical line will happen fairly often (always?) with the grid.
  if (topRight.x === bottomLeft.x) {
    x = topRight.x;
    y = l1.a * x + l1.b;
  } else {
    l2 = lineParameters(topRight, bottomLeft);
    x = (l1.b - l2.b) / (l2.a - l1.a);
    y = l1.a * x + l1.b;
  }

  return {x, y};
}

export const rectangleVerticalMidPoint = (topLeft: Coords, topRight: Coords, bottomLeft: Coords, bottomRight: Coords): Coords => {
  return {x: topRight.x, y: bottomLeft.y + (topRight.y - bottomLeft.y) / 2};
}

/**
   * given two points, I need to know the parameters that define the line between those points.
   * e.g. p1 = (x, y), p2 = (x', y') then there's a line between those two points
   * the line is y = ax + b
   * This function returns a and b.
   */
export const lineParameters = (p1: Coords, p2: Coords): {a: number, b: number} => {
  if (p1.x === p2.x) {
    throw new Error("vertical line. I need to handle this with a special case.");
  }
  const a = (p1.y - p2.y) / (p1.x - p2.x);
  const b = p1.y - p1.x * a;
  return {a, b};
}