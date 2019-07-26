import { composeWithDevTools } from "redux-devtools-extension";
import { logger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { createRootReducer } from "../modules/reducer";

export const history = createBrowserHistory();

const store = createStore(
  createRootReducer(history),
  composeWithDevTools(applyMiddleware(thunk, logger, routerMiddleware(history)))
);

export default store;
