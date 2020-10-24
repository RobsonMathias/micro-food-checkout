import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import { CheckoutApp } from "./App";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: CheckoutApp,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
  domElementGetter() {
    return document.querySelector(`[data-app='checkout']`)!;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
