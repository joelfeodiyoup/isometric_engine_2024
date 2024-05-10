import { createRoot } from 'react-dom/client';
import {store} from '../state/app/store';
import { Provider } from 'react-redux';
import { TopNav } from './TopNav';
import { Terrain } from './Terrain';
import React, { useState } from 'react';
import { Modal } from './layout-utilities/Modal';
import { SideNav } from './SideNav';
import { Layout } from './layout-utilities/Layout';
import { GameRender } from '../render/game-render';
import { Container } from './layout-utilities/Container';

/**
 * I wish I didn't have to do this. Surely not?
 */
export type BaseProps = React.HTMLAttributes<HTMLElement>;

const gameRender = new GameRender({dimensions: {width: 50, height: 50}});
const canvasStage = gameRender.element();
const CanvasContainer = () => <Container style={{height: '100%'}} child={canvasStage}></Container>

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  return (<>
    <Layout>
      {{
        top: <TopNav />,
        side: <SideNav />,
        gameRender: <CanvasContainer />,
        modal: <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}><p>I am something in the modal</p></Modal>
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
