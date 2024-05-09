import { createRoot } from 'react-dom/client';
import {store} from './../app/store';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from './../app/hooks';
import { increment } from '../features/counter/counterSlice';
import { toggle } from '../features/highlightType/highlightTypeSlice';
import { TopNav } from './TopNav';

const App = () => {
  const count = useAppSelector((state) => state.counter.value);
  const t = useAppSelector((state) => state.highlightType.value);
  const dispatch = useAppDispatch();
  return (<>
    <p>here is my app</p>
    <pre>count: {count}</pre>
    <button onClick={() => dispatch(increment())}>add</button>
    <pre>t: {t}</pre>
    <button onClick={() => dispatch(toggle())}>toggle</button>
    <TopNav></TopNav>
  </>)
}

const domNode = document.getElementById('root');
if (!domNode) {
  throw new Error('root element not found');
}
const root = createRoot(domNode);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
document.addEventListener("DOMContentLoaded", () => {
})

