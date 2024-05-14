import { createRoot } from "react-dom/client";
import { store } from "../state/app/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { TopNav } from "./TopNav";
import { useEffect, useState } from "react";
import { Modal } from "./layout-utilities/Modal";
import { SideNav } from "./SideNav";
import { Layout } from "./layout-utilities/Layout";
import { GameRender } from "../render/game-render";
import { Container } from "./layout-utilities/Container";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { closeModal, selectUiState } from "../state/features/ui/uiSlice";
import { getModal } from "./modals/useModalSelector";

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});
const authLink = setContext((_, { headers }) => {
  const authorization = store.getState().user.value.token;
  return {
    headers: {
      ...headers,
      authorization,
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// This is slightly weird code.
// I'm making an instance of the object that renders the game onto the canvas.
// Then I get the element, and eventually throw this inside react as <CanvasContainer>
// It's a bit weird. But the reason I'm doing it is that I like that GameRender on its own doesn't need to have anything to do with React.
// GameRender just checks out a Redux state instance (and I need to see how flexible that is). Hopefully you could use whatever you want for the ui, like svelte, angular, vue, whatever.
const gameRender = new GameRender({ dimensions: { width: 10, height: 10 } });
const canvasStage = gameRender.element();
const CanvasContainer = () => (
  <Container style={{ height: "100%" }} child={canvasStage}></Container>
);

const App = () => {
  const uiState = useSelector(selectUiState);
  const dispatch = useDispatch();

  // The ModalComponentContent gets changed based on the string stored in redux state
  // I think it's an interesting problem, and I'm sure there are also other ways that redux state could dynamically switch react component.
  const [ModalComponentContent, setModalComponentContent] = useState<
    () => JSX.Element | null
  >(getModal(uiState.modal));
  useEffect(() => {
    setModalComponentContent(getModal(uiState.modal));
  }, [uiState.modal]);

  return (
    <>
      <Layout>
        {{
          top: <TopNav />,
          side: <SideNav />,
          gameRender: <CanvasContainer />,
          modal: (
            <Modal
              isOpen={uiState.isModalOpen}
              onClose={() => dispatch(closeModal())}
            >
              <ModalComponentContent />
            </Modal>
          ),
        }}
      </Layout>
    </>
  );
};

const attachAppToDom = () => {
  const domNode = document.getElementById("ui-root");
  if (!domNode) {
    throw new Error("root element not found");
  }
  const root = createRoot(domNode);
  root.render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Provider>
  );
  document.addEventListener("DOMContentLoaded", () => {});
};

attachAppToDom();
