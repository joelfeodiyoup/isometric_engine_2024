// This is slightly weird code.
// I'm making an instance of the object that renders the game onto the canvas.
// Then I get the element, and eventually throw this inside react as <CanvasContainer>
// It's a bit weird. But the reason I'm doing it is that I like that GameRender on its own doesn't need to have anything to do with React.
// GameRender just checks out a Redux state instance (and I need to see how flexible that is). Hopefully you could use whatever you want for the ui, like svelte, angular, vue, whatever.

import { useEffect } from "react";
import { GameRender } from "../../render/game-render";
import { Container } from "../layout-utilities/Container";
import { useSelector } from "react-redux";
import {
  selectGameDimensions,
  selectGameState,
} from "../../state/features/gameState/gameStateSlice";
import { store } from "../../state/app/store";
import { selectZoom } from "../../state/features/gameControls/gameControlsSlice";
import { getHeightMap } from "../../render/heightmap";

const dimensions = store.getState().gameState.value.dimensions;
// getHeightMap(dimensions.width, dimensions.height).then((h) => {
  // the order of this logic is a little bit off.
  const gameRender = new GameRender(store.getState().gameState.value);
  const canvasStage = gameRender.element();
// });
export const GameRenderComponent = () => {
  // const gameState = useSelector(selectGameState);
  const gameState = useSelector(selectGameState);
  const zoom = useSelector(selectZoom);
  // const zoom = 2;
  useEffect(() => {
    // I think it could be better to have the game render class itself handle this,
    // through having that thing subscribe to the state?
    // or... rather than having a useEffect trigger this,
    // I think the state change should have some side-effect that calls the class to reset
    gameRender.reset(gameState);
  }, [gameState]);
  return <Container style={{ height: "100%" }} child={canvasStage}></Container>;
};

const minimapElement = gameRender.minimap();

export const MinimmapRenderComponent = () => {
  const rotation = store.getState().gameControls.value.rotation;
  const dimensions = useSelector(selectGameDimensions);
  useEffect(() => {}, [dimensions]);
  return (
    <Container
      className={`map-container rotation-${rotation}`}
      child={minimapElement}
    ></Container>
  );
};
