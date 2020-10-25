import React from "react";
import {
  StylesProvider,
  createGenerateClassName,
  jssPreset,
} from "@material-ui/core/styles";
import { create } from "jss";

const jss = create(jssPreset());

const generateClassName = createGenerateClassName({
  productionPrefix: "checkout",
  seed: "checkout",
});

function StyleProvider({ children }: any) {
  return (
    <StylesProvider
      jss={jss}
      generateClassName={generateClassName}
      children={children}
    />
  );
}

export { StyleProvider };
