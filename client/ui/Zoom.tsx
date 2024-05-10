import { useAppDispatch } from "../state/app/hooks"
import { increaseZoom } from "../state/features/zoom/zoomSlice";

export const Zoom = () => {
  const dispatch = useAppDispatch();
  return (<>
    <button onClick={() => dispatch(increaseZoom())}>zoom in</button>
  </>)
}