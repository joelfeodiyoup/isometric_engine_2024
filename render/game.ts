import { store } from "../app/store";
import { CanvasGrid, CanvasHover } from "./canvas";
import { Draw } from "./draw";
import { Grid } from "./grid";
import { GridCell } from "./grid-cell";
import { GridPoint } from "./grid-point";
import { ScreenPosition } from "./screen-position";

type GameOptions = {
  dimensions: {width: number, height: number},
}

/**
 * the client gets a function callback letting it know, when a user clicks,
 * which grid cell and which point the user has clicked near
 */
type onClickScreen = (
  grid: {x: number, y: number},
  point: {x: number, y: number}
) => void;



export class Game {
  public readonly grid: Grid;
  constructor(options: GameOptions) {
    this.grid = new Grid(options.dimensions.width, options.dimensions.height);
  }
}

const game = new Game({dimensions: {width: 5, height: 5}});

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

const originElementPosition = new ScreenPosition({x: 0, y: 0}, ({x, y}: {x: number, y: number}) => {});

const pointHandler = (x: number, y: number) => {
  const closest = game.grid.closestPoint(x, y);
  console.log(closest.point);
  closest.point?.adjustHeight(gameState['adjust-height'] as "raise" | "lower" ?? 'raise');
  return closest.point;
}

const clickHandler = (x: number, y: number) => {
  const state = store.getState();
  state.highlightType.value === "cell"
    ? cellHandler(x, y)
    : pointHandler(x, y);
  const filled = game.grid.gridCells.flat().filter(cell => cell.isFilled);
  canvasGrid.draw.clear;
  canvasGrid.draw.drawFilledRectangle(filled);
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
    closestCell && canvasHover.draw.drawFilledRectangle([closestCell], "darkgreen");
  }
}
const setHoveredPoint = (x: number, y: number) => {
  const closestPoint = game.grid.closestPoint(x, y).point;
  if (!closestPoint) { return;}
  if (hoveredPoint?.coords.x === closestPoint.coords.x && hoveredPoint.coords.y === closestPoint.coords.y) {

  } else {
    hoveredPoint = closestPoint;
    canvasHover.clear();
    hoveredPoint && canvasHover.draw.drawPoint(hoveredPoint)
  }
}
const mouseHoverHandler = (x: number, y: number) => {
  const state = store.getState();
  state.highlightType.value === "cell"
    ? setHoveredCell(x, y)
    : setHoveredPoint(x, y);
}

const canvasGrid = new CanvasGrid(/*originElementPosition, clickHandler, mouseHoverHandler*/);
const canvasHover = new CanvasHover(originElementPosition, clickHandler, mouseHoverHandler);
const drawGrid = () => canvasGrid.draw.drawGrid(game.grid.gridPoints);
canvasGrid.draw.drawFilledRectangle(game.grid.gridCells.flat());
drawGrid();
const drawCell = (cell: GridCell, i: number) => {
  canvasGrid.drawImage({x: cell.topLeft.coords.x, y: cell.topRight.coords.y}, {x: cell.bottomRight.coords.x, y: cell.bottomLeft.coords.y}, i);
}
// drawCell(game.grid.gridCells.flat()[1]!);
game.grid.gridCells.flat().forEach((cell, i) => {
  drawCell(cell, i);
})

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
setupInterface();

const setCameraPosition = ({x, y}: {x: number, y: number}) => {
  if (container) {
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
  }
}
const screenPosition = new ScreenPosition({x: 0, y: 0}, setCameraPosition);

const stage = document.getElementById('canvas-stage');
const container = document.getElementById('canvas-container');
const isRightClick = (event: MouseEvent) => event.button === 2;
stage?.addEventListener("mousedown", event => {
  if (!isRightClick(event)) { return; }
  screenPosition.startScroll(event.clientX, event.clientY)
  event.preventDefault();
});
stage?.addEventListener("mousemove", event => {
  screenPosition.midScroll(event.clientX, event.clientY);
})

stage?.addEventListener("mouseup", event => {
  if (!isRightClick(event)) { return; }
  screenPosition.endScroll(event.clientX, event.clientY);
})