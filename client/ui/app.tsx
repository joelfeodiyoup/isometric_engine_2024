import { createRoot } from 'react-dom/client';
import {store} from '../state/app/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { TopNav } from './TopNav';
import React, { ReactElement, useState } from 'react';
import { Modal } from './layout-utilities/Modal';
import { SideNav } from './SideNav';
import { Layout } from './layout-utilities/Layout';
import { GameRender } from '../render/game-render';
import { Container } from './layout-utilities/Container';
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { closeModal, selectUiState } from '../state/features/ui/uiSlice';

const middleware = new ApolloLink((operation, forward) => {
  const state = store.getState();
  const authorizationToken = state.user.value.token ?? '';
	const headers = {
		authorization: authorizationToken,
	};

	// add the authorization to the headers
	operation.setContext({
		headers,
	});

	return forward(operation);
});
const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
});
const authLink = setContext((_, {headers}) => {
  const authorization = store.getState().user.value.token;
  return {
    headers: {
      ...headers,
      authorization
    }
  }
})
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

/**
 * I wish I didn't have to do this. Surely not?
 */
export type BaseProps = React.HTMLAttributes<HTMLElement>;

const gameRender = new GameRender({dimensions: {width: 10, height: 10}});
const canvasStage = gameRender.element();
const CanvasContainer = () => <Container style={{height: '100%'}} child={canvasStage}></Container>

const App = () => {
  const uiState = useSelector(selectUiState);
  const dispatch = useDispatch();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (<>
    <Layout>
      {{
        top: <TopNav />,
        side: <SideNav />,
        gameRender: <CanvasContainer />,
        modal: <Modal isOpen={uiState.isModalOpen} onClose={() => dispatch(closeModal())}><p>I am something in the modal</p></Modal>
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
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>
);
document.addEventListener("DOMContentLoaded", () => {
})
