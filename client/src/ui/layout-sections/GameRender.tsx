// This is slightly weird code.
// I'm making an instance of the object that renders the game onto the canvas.
// Then I get the element, and eventually throw this inside react as <CanvasContainer>
// It's a bit weird. But the reason I'm doing it is that I like that GameRender on its own doesn't need to have anything to do with React.
// GameRender just checks out a Redux state instance (and I need to see how flexible that is). Hopefully you could use whatever you want for the ui, like svelte, angular, vue, whatever.

import { GameRender } from "../../render/game-render";
import { Container } from "../layout-utilities/Container";

// const gameRender = new GameRender({ dimensions: { width: 10, height: 10 } });
const gameRender = new GameRender({ dimensions: { width: 10, height: 10 } });
const canvasStage = gameRender.element();
export const GameRenderComponent = () => (
  <Container style={{ height: "100%" }} child={canvasStage}></Container>
);