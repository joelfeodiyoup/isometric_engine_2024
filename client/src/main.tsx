import { createRoot } from "react-dom/client";
import { AppWrapper } from "./ui/App";
import { generateGrid } from "./render/utils/perlin-noise";

const attachAppToDom = () => {
  const domNode = document.getElementById("ui-root");
  if (!domNode) {
    throw new Error("root element not found");
  }
  const root = createRoot(domNode);
  root.render(
    <AppWrapper />
  );
};

attachAppToDom();
