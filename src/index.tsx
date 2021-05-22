import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <style>{`
      html,
      body {
        margin: 0;
      }
      body {
        overflow-y: scroll;
      }
      code {
        background-color: rgba(0,0,0,0.05);
        font-size: 0.9em;
        padding: 0.1em 0.3em
      }
    `}</style>
  </React.StrictMode>,
  document.getElementById("root")
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
