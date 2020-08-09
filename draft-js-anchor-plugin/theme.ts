import {CSSProperties} from "react";


export const defaultTheme: {[name: string]: CSSProperties} = {
  input: {
    height: "34px",
    width: "420px",
    padding: "0 12px",
    fontSize: "15px",
    fontFamily: "inherit",
    backgroundColor: "transparent",
    border: "none",
    color: "#444",
  },
  inputInvalid: {
    color: "#e65757"
  },

  link: {
    color: "#2996da",
    textDecoration: "underline"
  }
};
