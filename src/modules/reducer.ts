import { combineReducers } from "redux";
import { connectRouter, RouterState } from "connected-react-router";
import { History } from "history";
import { reducer as authReducer, State as AuthState } from "./auth";
import { reducer as channelReducer, State as ChannelState } from "./channel";
import { reducer as threadReducer, State as ThreadState } from "./thread";
import { reducer as userReducer, State as UserState } from "./user";
import { reducer as messageReducer, State as MessageState } from "./message";

export interface AppState {
  router: RouterState;
  auth: AuthState;
  channel: ChannelState;
  thread: ThreadState;
  user: UserState;
  message: MessageState;
}

export const createRootReducer = (history: History) =>
  combineReducers({
    auth: authReducer,
    router: connectRouter(history),
    channel: channelReducer,
    thread: threadReducer,
    user: userReducer,
    message: messageReducer
  });
