import { globals } from "./globals";

type CanvasIds = "canvas-build" | "canvas-base" | "canvas-grid" | "canvas-hover" | "canvas-mouse-handler";
/**
 * This builds all the html needed for the render.
 * This includes things like canvas elements, containers for the canvas, etc
 * At times this needs to be recreated, e.g. for a new game, where old event listeners are removed, new ones created, etc.
 * -> And, possibly, a better way would be to keep the elements and throw out the event listeners. I'm not sure. This at least makes the html more easily programmable, for adjustments,
 * -> e.g. one future idea is to have a grid of canvas elements, to split the screen into parts, for performance reasons etc (canvas has a maximum area size)
 */
export class BuildHtmlElement {
  public static getRenderElement(dimensions: {width: number, height: number}) {
    const elements = {
      canvasStage: BuildHtmlElement.canvasStage(),
      canvasContainer: BuildHtmlElement.canvasContainer(),
      canvases: {
        canvasBase: BuildHtmlElement.canvasElement("canvas-base"),
        canvasGrid: BuildHtmlElement.canvasElement("canvas-grid"),
        canvasBuild: BuildHtmlElement.canvasElement("canvas-build"),
        canvasBuildTemp: BuildHtmlElement.canvasElement("canvas-build-temp"),
        canvasHover: BuildHtmlElement.canvasElement("canvas-hover"),
        canvasMouseHandler: BuildHtmlElement.canvasElement("canvas-mouse-handler"),
      },
      /**
   * a canvas where I will draw some things to help debug.
   * E.g. a centre point to make sure we can centre on specific cells.
   */
      debugCanvas: BuildHtmlElement.debugCanvasElement(),
      minimapCanvas: BuildHtmlElement.canvasElement("minimap-canvas", dimensions.width, dimensions.height),
    };

    Object.values(elements.canvases).forEach(canvas => {
      elements.canvasContainer.appendChild(canvas);
    });

    return elements;
  }
  private static canvasStage() {
    const element = document.createElement('div');
    element.style.isolation = 'isolate';
    element.id = 'canvas-stage';
    return element;
  }
  private static canvasContainer() {
    const element = document.createElement('div');
    element.oncontextmenu = () => false;
    element.id = "canvas-container";
    return element;
  }
  private static canvasElement(id: string, height: number | undefined = 4000, width: number | undefined = 4000) {
    const canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.height = height;
    canvas.width = width;
    canvas.style.border = globals.displayDebugCanvas ? "1px solid yellow" : '';
    return canvas;
  }

  private static debugCanvasElement() {
    const el = BuildHtmlElement.canvasElement("canvas-debug");
    el.style.pointerEvents = "none";
    el.style.top = "0";
    el.style.display = globals.displayDebugCanvas ? 'block' : 'none';
    return el;
  }
}