import React from "react";
import ReactDOM from "react-dom";
import Home from "./Home";
const App = () => (
  <Home endpoint="/api/grabit/" />
);
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;