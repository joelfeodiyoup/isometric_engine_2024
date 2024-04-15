import { CanvasGrid, CanvasHover } from "./canvas";
import { Draw } from "./draw";
import { Grid } from "./grid";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";

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

export class OriginPosition {
  constructor(public x = 0, public y = 0) {}
}
const originElementPosition = new OriginPosition();

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

let hoveredCell = null as null | GridCell;
let hoveredPoint = null as null | GridPoint;
const setHoveredCell = (x: number, y: number) => {
  const closestCell = game.grid.closestCell(x, y);
  if (!closestCell) { return;}
  if (hoveredCell?.x === closestCell.x && hoveredCell.y === closestCell.y) {
  
  } else {
    hoveredCell = closestCell;
    canvasHover.clear();
    closestCell && Draw.drawFilledRectangle([closestCell], canvasHover, "lightgreen");
  }
}
const setHoveredPoint = (x: number, y: number) => {
  const closestPoint = game.grid.closestPoint(x, y).point;
  if (!closestPoint) { return;}
  if (hoveredPoint?.coords.x === closestPoint.coords.x && hoveredPoint.coords.y === closestPoint.coords.y) {

  } else {
    hoveredPoint = closestPoint;
    canvasHover.clear();
    hoveredPoint && Draw.drawPoint(hoveredPoint, canvasHover)
  }
}
const mouseHoverHandler = (x: number, y: number) => {
  gameState["cell-point-toggle"] === "cell"
    ? setHoveredCell(x, y)
    : setHoveredPoint(x, y);
}

const canvasGrid = new CanvasGrid(originElementPosition, clickHandler, mouseHoverHandler);
const canvasHover = new CanvasHover(originElementPosition, clickHandler, mouseHoverHandler);
const drawGrid = () => Draw.drawGrid(game.grid.gridPoints, canvasGrid);
drawGrid();

const setupInterface = () => {
  console.log('setting up?')
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
console.log('adding the event listener?');
setupInterface();

const stage = document.getElementById('canvas-stage');
const container = document.getElementById('canvas-container');
let originClickPosition = null as null | {x: number, y: number};


stage?.addEventListener("mousedown", event => {
  originClickPosition = {x: event.clientX, y: event.clientY};
  console.log(originClickPosition);
  event.preventDefault();
});
const move = (x: number, y: number) => {
  if (originClickPosition) {
    return {x: x - originClickPosition.x, y: y - originClickPosition.y};
  } else {
    // what is this??
    return {x, y};
  }
}
stage?.addEventListener("mousemove", event => {
  if (originClickPosition && container) {
    const moveAmount = move(event.clientX, event.clientY);
    const newPosition = {x: originElementPosition.x - moveAmount.x, y: originElementPosition.y - moveAmount.y};
    container.style.left = `${newPosition.x}px`;
    container.style.top = `${newPosition.y}px`;
  }
})
stage?.addEventListener("mouseup", event => {
  const moveAmount = move(event.clientX, event.clientY);
  originElementPosition.x = originElementPosition.x - moveAmount.x
  originElementPosition.y = originElementPosition.y - moveAmount.y;
  originClickPosition = null;
})