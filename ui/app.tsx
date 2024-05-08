import { createRoot } from 'react-dom/client';
import react, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  return (<>
    <p>here is my app</p>
    <pre>count: {count}</pre>
    <button onClick={() => setCount(count + 1)}>add</button>
  </>)
}

const domNode = document.getElementById('root');
if (!domNode) {
  throw new Error('root element not found');
}
const root = createRoot(domNode);
root.render(<App />);
document.addEventListener("DOMContentLoaded", () => {
})

