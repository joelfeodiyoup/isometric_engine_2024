import { store } from "../state/app/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { TopNav } from "./layout-sections/TopNav";
import { useEffect, useState } from "react";
import { Modal } from "./layout-utilities/Modal";
import { SideNav } from "./layout-sections/SideNav";
import { Layout } from "./layout-utilities/Layout";
import { closeModal, selectUiState } from "../state/features/ui/uiSlice";
import { getModal } from "./modals/useModalSelector";
import { GraphqlClient } from "./graphql/graphql-client";
import { GameRenderComponent } from "./layout-sections/GameRender";
import { ApolloProvider } from "@apollo/client";
import { selectGameDimensions } from "../state/features/gameState/gameStateSlice";

const App = () => {
  const uiState = useSelector(selectUiState);
  const dispatch = useDispatch();

  // The ModalComponentContent gets changed based on the string stored in redux state
  // I think it's an interesting problem, and I'm sure there are also other ways that redux state could dynamically switch react component.
  // const [ModalComponentContent, setModalComponentContent] = useState<
  //   () => JSX.Element | null
  // >(getModal(uiState.modal));
  // useEffect(() => {
  //   setModalComponentContent(getModal(uiState.modal));
  // }, [uiState.modal]);

  return (
    <>
      <Layout>
        {{
          top: <TopNav />,
          side: <SideNav />,
          gameRender: <GameRenderComponent />,
          modal: <>
            {uiState.modal.map((modalKey, i) => {
            const ModalInstance = getModal(modalKey);
              return <Modal
                onClose={() => dispatch(closeModal(modalKey))}
                >
                <ModalInstance/>
            </Modal>
            })}
            </>
        }}
      </Layout>
    </>
  );
};

export const AppWrapper = () => {
  return <Provider store={store}>
    <ApolloProvider client={GraphqlClient.getClient()}>
      <App />
    </ApolloProvider>
  </Provider>;
}