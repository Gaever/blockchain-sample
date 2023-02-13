import { configBigNumber } from "@ctocker/lib/build/main/src/utils";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/nprogress.css";

configBigNumber();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
