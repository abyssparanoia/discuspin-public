import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { Dispatch } from "redux";
import { db } from "./firebase";
import { Message, buildMessage } from "./entity/message";
import { createMessage } from "./repository/message";

export interface State {
  list: Message[];
  isLoading: boolean;
  errorMessage?: string;
  watchMessage: {
    unsubscribe?: () => void;
  };
}

const intialState: State = {
  list: [],
  isLoading: false,
  errorMessage: undefined,
  watchMessage: {
    unsubscribe: undefined
  }
};

const actionCreator = actionCreatorFactory("thread");

export const actions = {
  watchMessage: actionCreator.async<void, void, { message: string }>(
    "WATCH_MESSAGE"
  ),
  sendMessage: actionCreator.async<void, void, { message: string }>(
    "SEND_MESSAGE"
  ),
  unWatchMessage: actionCreator<void>("UNWATCH_MESSAGE"),
  addMessage: actionCreator<{ message: Message }>("ADD_MESSAGE"),
  changeMessage: actionCreator<{ message: Message }>("CHANGE_MESSAGE"),
  setMessageUnsubscribe: actionCreator<{ unsubscribe: () => void }>(
    "SET_MESSAGE_UNSUBSCRIBE"
  )
};

export const watchMessages = (threadId: string) => async (
  dispatch: Dispatch
) => {
  dispatch(actions.watchMessage.started());
  const unsubscribe = db
    .collection("threads")
    .doc(threadId)
    .collection("messages")
    .orderBy("createdAt")
    .onSnapshot(snap => {
      snap!.docChanges().forEach(async change => {
        const message: Message = await buildMessage(
          change.doc.id,
          change.doc.data()
        );
        // 追加時
        if (change.type === "added") {
          dispatch(actions.addMessage({ message: message }));
        }
        // 変更時
        else if (change.type === "modified") {
          dispatch(actions.changeMessage({ message: message }));
        }
      });
    });
  dispatch(actions.setMessageUnsubscribe({ unsubscribe: unsubscribe }));
  dispatch(actions.watchMessage.done({}));
};

export const sendMessage = (
  threadId: string,
  userId: string,
  body: string
) => async (dispatch: Dispatch) => {
  dispatch(actions.sendMessage.started());
  try {
    await createMessage(threadId, userId, body);
    dispatch(actions.sendMessage.done({}));
  } catch (error) {
    dispatch(actions.sendMessage.failed({ error: { message: error } }));
  }
};

export const unWatchMessage = () => (dispatch: Dispatch) => {
  dispatch(actions.unWatchMessage());
};

export const reducer = reducerWithInitialState(intialState)
  // スレッド取得
  .case(actions.watchMessage.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.watchMessage.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.watchMessage.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    errorMessage: payload.error.message
  }))
  .case(actions.sendMessage.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.sendMessage.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.sendMessage.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    errorMessage: payload.error.message
  }))
  .case(actions.setMessageUnsubscribe, (state, payload) => ({
    ...state,
    watchMessage: {
      unsubscribe: payload.unsubscribe
    }
  }))
  .case(actions.addMessage, (state, payload) => {
    const list = [...state.list];
    list.push(payload.message);
    list.sort((a, b) => a.createdAt - b.createdAt);
    return {
      ...state,
      list: list
    };
  })
  .case(actions.changeMessage, (state, payload) => {
    const list = [...state.list];
    const message = payload.message;
    const index = list.findIndex(item => item.id === message.id);
    list[index] = message;
    return {
      ...state,
      list: list
    };
  })
  .case(actions.unWatchMessage, (state, _) => {
    if (state.watchMessage.unsubscribe) state.watchMessage.unsubscribe();
    return { ...state, watchMessage: { unsubscribe: undefined }, list: [] };
  })
  .build();
