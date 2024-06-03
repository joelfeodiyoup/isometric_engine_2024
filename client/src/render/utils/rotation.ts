import { store } from "../../state/app/store";

export type RotationDirection = "north" | "east" | "south" | "west";
export class Rotation {

  /**
   * Semantic naming of the current rotation.
   * i.e. "are we looking to the north, east, south, whatever..."
   */
  static get currentSemanticRotation(): RotationDirection {
    const rotationIndex = store.getState().gameControls.value.rotation;
    const rotationDirections: RotationDirection[] = ["north", "east", "south", "west"];
    return rotationDirections[rotationIndex];
  }
}