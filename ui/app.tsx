import { createRoot } from 'react-dom/client';
import {store} from '../state/app/store';
import { Provider } from 'react-redux';
import { toggle } from '../state/features/highlightType/highlightTypeSlice';
import { TopNav } from './TopNav';
import { Terrain } from './Terrain';

const App = () => {
  return (<>
    <TopNav></TopNav>
    <Terrain />
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
