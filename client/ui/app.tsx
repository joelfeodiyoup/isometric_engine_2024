import { createRoot } from 'react-dom/client';
import {store} from '../state/app/store';
import { Provider } from 'react-redux';
import { TopNav } from './TopNav';
import { Terrain } from './Terrain';
import { useState } from 'react';
import { Modal } from './layout-utilities/Modal';
import { SideNav } from './SideNav';
import { Layout } from './layout-utilities/Layout';
import { Game } from '../render/game';
import { Container } from './layout-utilities/Container';

const game = new Game({dimensions: {width: 5, height: 5}});
const canvasStage = game.element();
const CanvasContainer = () => <Container child={canvasStage}></Container>

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  return (<>
    <Layout>
      {{
        top: <TopNav />,
        side: <SideNav />,
        modal: <CanvasContainer />
        // modal: <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}><p>I am something in the modal</p></Modal>
      }}
    </Layout>
  </>)
}

const domNode = document.getElementById('ui-root');
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
