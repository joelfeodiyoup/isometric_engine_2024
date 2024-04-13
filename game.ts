import { CanvasGrid, CanvasHover } from "./canvas";
import { Draw } from "./draw";
import { Grid } from "./grid";
import { GridCell } from "./grid-cell";

export class Game {
  public readonly grid: Grid;
  constructor(width = 10, height = 10) {
    this.grid = new Grid(width, height);
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
  Draw.clear(canvasGrid);
  Draw.drawFilledRectangle(filled, canvasGrid);
  drawGrid();
};

const initialScreenPosition = {x: 0, y: 0};

let hoveredCell = null as null | GridCell;
const mouseHoverHandler = (x: number, y: number) => {
  const closestCell = game.grid.closestCell(x, y);
  if (!closestCell) { return;}
  if (hoveredCell?.x === closestCell.x && hoveredCell.y === closestCell.y) {

  } else {
    hoveredCell = closestCell;
    canvasHover.clear();
    closestCell && Draw.drawFilledRectangle([closestCell], canvasHover, "lightgreen");
  }
}

const canvasGrid = new CanvasGrid(clickHandler, mouseHoverHandler);
const canvasHover = new CanvasHover(clickHandler, mouseHoverHandler);
const drawGrid = () => Draw.drawGrid(game.grid.gridPoints, canvasGrid);
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