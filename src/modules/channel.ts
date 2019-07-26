import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { Dispatch } from "redux";
import { Channel } from "./entity/channel";
import * as channelRepository from "./repository/channel";
import { db } from "./firebase";
import { push } from "connected-react-router";

export interface State {
  channels: Channel[];
  errorMessage: string | null;
  isLoading: boolean;
  error?: Error;
  watchChannel: {
    unsubscribe?: () => void;
  };
}

const initialState: State = {
  channels: [],
  errorMessage: null,
  isLoading: false,
  watchChannel: {
    unsubscribe: undefined
  }
};

const actionCreator = actionCreatorFactory("channel");
export const actions = {
  addChannel: actionCreator.async<void, void, void>("ADD_CHANNEL"),
  watchChannels: actionCreator.async<
    void,
    { channels: Channel[] },
    { message: string }
  >("WATCH_CHANNELS"),
  unWatchChannels: actionCreator<void>("UNWATCH_CHANNELS"),
  setChannleUnsubscribe: actionCreator<{ unsubscribe: () => void }>(
    "SET_CHANNEL_UNSUBSCRIBE"
  )
};

export const addChannel = (name: string, description: string) => async (
  dispatch: Dispatch
) => {
  dispatch(actions.addChannel.started());
  const channelId = await channelRepository.addChannel(name, description);
  dispatch(push(`/${channelId}/threads`));
  dispatch(actions.addChannel.done({}));
};

export const watchChannels = () => (dispatch: Dispatch) => {
  dispatch(actions.watchChannels.started());
  const unsubscribe = db.collection("channels").onSnapshot(async () => {
    try {
      const channels = await channelRepository.getChannels();
      dispatch(actions.watchChannels.done({ result: { channels } }));
    } catch (error) {
      dispatch(
        actions.watchChannels.failed({
          error: {
            message: `ユーザー一覧の取得に失敗しました [${error}]`
          }
        })
      );
    }
  });

  dispatch(actions.setChannleUnsubscribe({ unsubscribe }));
};

export const unWatchChannels = () => (dispatch: Dispatch) => {
  dispatch(actions.unWatchChannels());
};

export const reducer = reducerWithInitialState(initialState)
  .case(actions.addChannel.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.addChannel.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.addChannel.failed, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.watchChannels.started, state => ({
    ...state
  }))
  .case(actions.watchChannels.done, (state, paylaod) => ({
    ...state,
    channels: paylaod.result.channels
  }))
  .case(actions.watchChannels.failed, (state, payload) => ({
    ...state,
    errorMessage: payload.error.message
  }))
  .case(actions.setChannleUnsubscribe, (state, payload) => ({
    ...state,
    watchChannel: {
      unsubscribe: payload.unsubscribe
    }
  }))
  .case(actions.unWatchChannels, (state, _) => {
    state.watchChannel.unsubscribe!();
    return { ...state, watchChannel: { unsubscribe: undefined }, channels: [] };
  })
  .build();
