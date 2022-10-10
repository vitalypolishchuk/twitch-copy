import React from "react";
import ReactDOM from "react-dom/client";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import reducers from "../src/reducers";
import App from "./components/App";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, /* preloadedState, */ composeEnhancers(applyMiddleware()));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
