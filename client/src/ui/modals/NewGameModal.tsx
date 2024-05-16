import { ModalInstance } from "../layout-utilities/Modal"

export const NewGameModal = () => {
  return <ModalInstance heading="new game" actions={[
    {label: "new game", onClick: () => console.log('new game (not implemented')}
  ]}></ModalInstance>
}