import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { Dispatch } from "redux";
import { db } from "./firebase";
import { Thread } from "./entity/thread";
import {
  getThreads,
  addThread as addThreadToFirebase
} from "./repository/thread";

import { push } from "connected-react-router";
export interface State {
  list: Thread[];
  isLoading: boolean;
  errorMessage?: string;
  watchThread: {
    unsubscribe?: () => void;
  };
}

const intialState: State = {
  list: [],
  isLoading: false,
  errorMessage: undefined,
  watchThread: {
    unsubscribe: undefined
  }
};

const actionCreator = actionCreatorFactory("thread");

// アクション
export const actions = {
  fetchThreads: actionCreator.async<
    void,
    { threads: Thread[] },
    { message: string }
  >("FETCH_THREADS"),
  addThread: actionCreator.async<void, void, { message: string }>("ADD_THREAD"),
  watchThreads: actionCreator.async<
    void,
    { threads: Thread[] },
    { message: string }
  >("WATCH_THREADS"),
  unWatchThread: actionCreator<void>("UNWATCH_THREADS"),
  setUnsubscribeThread: actionCreator<{ unsubscribe: () => void }>(
    "SET_UNSUBSCRIBE_THREAD"
  )
};

// スレッドの取得
export const fetchThreads = (channel_id: string) => async (
  dispatch: Dispatch
) => {
  dispatch(actions.fetchThreads.started());
  try {
    const threads = await getThreads(channel_id);
    dispatch(actions.fetchThreads.done({ result: { threads: threads } }));
  } catch (err) {
    dispatch(
      actions.fetchThreads.failed({
        error: {
          message: err
        }
      })
    );
  }
};

// スレッドの追加
export const addThread = (
  title: string,
  description: string,
  channel_id: string,
  user_id: string
) => async (dispatch: Dispatch) => {
  dispatch(actions.addThread.started());
  try {
    const thread_id = await addThreadToFirebase(
      title,
      description,
      channel_id,
      user_id
    );
    dispatch(push(`/${channel_id}/threads/${thread_id}/`));
    dispatch(actions.addThread.done({}));
  } catch (err) {
    dispatch(
      actions.addThread.failed({
        error: {
          message: err
        }
      })
    );
  }
};

export const watchThread = (channel_id: string) => async (
  dispatch: Dispatch
) => {
  dispatch(actions.watchThreads.started());
  const unsubscribe = db
    .collection("threads")
    .where("channelID", "==", channel_id)
    .onSnapshot(async () => {
      try {
        const threads = await getThreads(channel_id);
        dispatch(actions.watchThreads.done({ result: { threads: threads } }));
      } catch (error) {
        dispatch(
          actions.watchThreads.failed({
            error: {
              message: `スレッドの監視開始に失敗しました${error}`
            }
          })
        );
      }
    });
  dispatch(actions.unWatchThread());
  dispatch(actions.setUnsubscribeThread({ unsubscribe: unsubscribe }));
};

export const unWatchThread = () => (dispatch: Dispatch) => {
  dispatch(actions.unWatchThread());
};

export const reducer = reducerWithInitialState(intialState)
  // スレッド取得
  .case(actions.fetchThreads.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.fetchThreads.done, (state, payload) => ({
    ...state,
    isLoading: false,
    list: payload.result.threads
  }))
  .case(actions.fetchThreads.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    errorMessage: payload.error.message
  }))
  // スレッド追加
  .case(actions.addThread.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.addThread.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.addThread.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    errorMessage: payload.error.message
  }))
  // スレッドの監視
  .case(actions.watchThreads.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.watchThreads.done, (state, payload) => ({
    ...state,
    isLoading: false,
    list: payload.result.threads
  }))
  .case(actions.watchThreads.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    errorMessage: payload.error.message
  }))
  // スレッドの監視をやめる
  .case(actions.unWatchThread, state => {
    if (state.watchThread.unsubscribe) {
      state.watchThread.unsubscribe!();
    }

    return {
      ...state,
      list: [],
      watchThread: {
        unsubscribe: undefined
      }
    };
  })
  .build();
