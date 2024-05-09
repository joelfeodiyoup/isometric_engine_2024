import { ReactElement, useState } from "react";

export const Modal = ({
  children,
  isOpen,
  onClose
}: {
  children?: ReactElement,
  isOpen: boolean,
  onClose: () => void
}) => {
  return <>{(children && isOpen) && <section
    style={{
      background: 'white',
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}
  ><button onClick={onClose}>close</button>{isOpen && children}
  </section>}</>;
};
