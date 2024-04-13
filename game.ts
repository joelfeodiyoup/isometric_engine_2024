import { Draw } from "./draw";
import { Grid } from "./grid";
import { Coords } from "./isometric";

export class Game {
  public readonly grid: Grid;
  constructor(width = 10, height = 10) {
    this.grid = new Grid(width, height);
  }
}


export class Canvas {
  private ctx: CanvasRenderingContext2D;
  
  constructor(
    onClick: (x: number, y: number) => void,
    private screen: Coords = {x: 0, y: 0}
  ) {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      throw new Error("oh no. No canvas found.");
    }
    this.ctx = ctx;

    canvas.onclick = (event) => {
      onClick(event.offsetX, event.offsetY);
    }
  }

  drawLine(from: Coords, to: Coords) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.translateX(from.x), this.translateY(from.y));
    this.ctx.moveTo(this.translateX(from.x), this.translateY(from.y));
    this.ctx.lineTo(this.translateX(to.x), this.translateY(to.y));
    this.ctx.stroke();
  }

  drawFilledPolygon(points: Coords[]) {
    
    const region = new Path2D();
    points[0] && region.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => {
      region.lineTo(p.x, p.y);
    });
    region.closePath();
    this.ctx.fillStyle = "green";
    this.ctx.fill(region);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  moveScreen(x: number, y: number) {
    this.screen.x += x;
    this.screen.y += y;
  }

  private translateX(x: number) {
    return x + this.screen.x;
  }
  private translateY(y: number) {
    return y + this.screen.y;
  }
}

const game = new Game(30,30);

const cellHandler = (x: number, y: number) => {
  const closest = game.grid.closestCell(x, y);
  if (closest) {
    closest.isFilled = !closest.isFilled;
  }
}
let gameState = {
  "adjust-height": 'raise',
  "cell-point-toggle": "cell"
};

const pointHandler = (x: number, y: number) => {
  const closest = game.grid.closestPoint(x, y);
  console.log(closest.point);
  closest.point?.adjustHeight(gameState['adjust-height'] as "raise" | "lower" ?? 'raise');
  return closest.point;
}

const clickHandler = (x: number, y: number) => {
  gameState["cell-point-toggle"] === "cell"
    ? cellHandler(x, y)
    : pointHandler(x, y);
  const filled = game.grid.gridCells.flat().filter(cell => cell.isFilled);
  Draw.clear(canvas);
  Draw.drawFilledRectangle(filled, canvas);
  drawGrid();
};

const initialScreenPosition = {x: 0, y: 0};

const canvas = new Canvas(clickHandler, initialScreenPosition);
const drawGrid = () => Draw.drawGrid(game.grid.gridPoints, canvas);
drawGrid();

const setupInterface = () => {
  const form = document.querySelector("form");
  if (!form) { return; }
  form.addEventListener(
    "change",
    (event) => {
      const data = new FormData(form);
      console.log(data);
      let output = "";
      for (const entry of data) {
        output = `${output}${entry[0]}=${entry[1]}\r`;
        const key = entry[0];
        if (key === "adjust-height") {
          gameState[key] = entry[1] as "raise" | "lower";
        }
        if (key === "cell-point-toggle") {
          gameState[key] = entry[1] as "cell" | "point";
        }
      }
      console.log(output);
      event.preventDefault();
    }, false,
  )
}
setupInterface();