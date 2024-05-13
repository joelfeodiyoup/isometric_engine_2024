import { useDispatch } from "react-redux"
import { closeModal } from "../../state/features/ui/uiSlice"
import { useState } from "react";
import { store } from "../../state/app/store";

export const SaveModal = () => {
  const dispatch = useDispatch();
  const [v, setV] = useState('initialValue');
  const myHookValue = useMyHook(v);
  return (<>
    <pre>hook: {myHookValue}</pre>
    <input onChange={event => setV(event.target.value)} />

    <button onClick={() => console.log('saved (to be implemented)')}>Save</button>
    <button onClick={() => dispatch(closeModal())}>Cancel</button>
  </>)
}

const useMyHook = (v: string) => {
  console.log('running my hook');
  return `current value in my hook: [${v}]`;
}