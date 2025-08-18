import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppContext from "./context/AppContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import rootStore from "./redux/index.js";

createRoot(document.getElementById("root")).render(
  <Provider store={rootStore}>
    <BrowserRouter>
      <AppContext>
        <App />
      </AppContext>
    </BrowserRouter>
  </Provider>
);
