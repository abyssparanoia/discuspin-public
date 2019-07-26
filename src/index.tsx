import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store, { history } from "./store";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { deepPurple, indigo } from "@material-ui/core/colors";
import { ConnectedRouter } from "connected-react-router";

const theme = createMuiTheme({
  // カラーパレット
  palette: {
    type: "dark",
    // メインカラー
    primary: deepPurple,
    secondary: indigo
  },
  // レスポンシブレイアウト用の指定
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl"],
    values: {
      xs: 360, // スマホ用
      sm: 768, // タブレット用
      md: 992, // PC用
      lg: 1000000000,
      xl: 1000000000
    }
  },
  // Material-UIコンポーネントのclassのstyleを上書きする
  overrides: {
    MuiButton: {
      root: {
        // ボタン内アルファベット文字を大文字変換しない
        textTransform: "none"
      }
    }
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
