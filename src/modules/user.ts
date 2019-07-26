import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { Dispatch } from "redux";
import { User, buildUser } from "./entity/user";
import * as userRepository from "./repository/user";
import { db } from "./firebase";

const actionCreator = actionCreatorFactory("user");

export const actions = {
  fetchMe: actionCreator.async<void, { user: User }, { message: string }>(
    "FETCH_ME"
  ),

  addUser: actionCreator.async<void, { user: User }, { message: string }>(
    "ADD_USER"
  ),
  watchUser: actionCreator.async<void, { user?: User }, { message: string }>(
    "WATCH_USER"
  ),
  updateUser: actionCreator.async<void, { user?: User }, { message: string }>(
    "UPDATE_USER"
  ),
  unWatchUser: actionCreator<void>("UNWATCH_USER"),
  setUserUnsubscribe: actionCreator<{ unsubscribe: () => void }>(
    "SET_USER_UNSUBSCRIBE"
  ),
  setUser: actionCreator<{ user?: User }>("SET_USER"),
  setExist: actionCreator<void>("SET_EXIST")
};

export interface State {
  user?: User;
  isLoading: boolean;
  errorMessage?: string;
  exist: boolean;
  watchUser: {
    unsubscribe?: () => void;
  };
}

const initialState: State = {
  user: undefined,
  isLoading: false,
  errorMessage: undefined,
  exist: false,
  watchUser: {}
};

// 自分の情報を取得する
export const fetchMe = () => async (dispatch: Dispatch) => {
  dispatch(actions.fetchMe.started());
  try {
    const user = await userRepository.fetchMe();
    dispatch(
      actions.fetchMe.done({
        result: {
          user: user!
        }
      })
    );
  } catch (err) {
    dispatch(
      actions.fetchMe.failed({
        error: {
          message: `[fetch me に失敗しました] ${err}`
        }
      })
    );
  }
};

// user を監視する
export const watchUser = (id: string) => async (dispatch: Dispatch) => {
  dispatch(actions.watchUser.started());
  const unsubscribe = db
    .collection("users")
    .doc(id)
    .onSnapshot(snapshot => {
      if (!snapshot.exists) {
        dispatch(actions.watchUser.done({ result: { user: undefined } }));
        return;
      }

      const user = buildUser(snapshot.id, snapshot.data()!);
      dispatch(actions.setExist());
      dispatch(actions.watchUser.done({ result: { user: user } }));
    });
  dispatch(actions.setUserUnsubscribe({ unsubscribe: unsubscribe }));
};

export const unWatchUser = () => (dispatch: Dispatch) => {
  dispatch(actions.unWatchUser());
};

export const addUser = (
  id: string,
  displayName: string,
  position?: string,
  description?: string,
  avatarURL?: string
) => async (dispatch: Dispatch) => {
  dispatch(actions.addUser.started());
  try {
    const user = await userRepository.addUser(
      id,
      displayName,
      position,
      description,
      avatarURL
    );
    dispatch(actions.addUser.done({ result: { user: user } }));
  } catch (error) {
    dispatch(actions.addUser.failed({ error: { message: error } }));
  }
};

export const updateUser = (
  id: string,
  displayName?: string,
  position?: string,
  description?: string,
  avatarURL?: string
) => async (dispatch: Dispatch) => {
  dispatch(actions.updateUser.started());
  try {
    const user = await userRepository.updateUser(
      id,
      displayName,
      position,
      description,
      avatarURL
    );
    dispatch(
      actions.updateUser.done({
        result: {
          user: user
        }
      })
    );
  } catch (error) {
    dispatch(
      actions.updateUser.failed({
        error: {
          message: error
        }
      })
    );
  }
};

export const reducer = reducerWithInitialState(initialState)
  .case(actions.fetchMe.started, state => ({ ...state, isLoading: true }))
  .case(actions.fetchMe.done, (state, payload) => ({
    ...state,
    isLoading: false,
    user: payload.result.user
  }))
  .case(actions.fetchMe.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    errorMessage: payload.error.message
  }))
  .case(actions.setUser, (state, payload) => ({
    ...state,
    user: payload.user
  }))
  .case(actions.watchUser.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.watchUser.done, (state, payload) => ({
    ...state,
    user: payload.result.user,
    isLoading: false
  }))
  .case(actions.watchUser.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    errorMessage: payload.error.message
  }))
  .case(actions.unWatchUser, state => {
    if (state.watchUser.unsubscribe) state.watchUser.unsubscribe();
    return { ...state, watchUser: { unsubscribe: undefined }, user: undefined };
  })
  .case(actions.setExist, state => ({
    ...state,
    exist: true
  }))
  .case(actions.addUser.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.addUser.done, (state, payload) => ({
    ...state,
    user: payload.result.user,
    isLoading: false
  }))
  .case(actions.addUser.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    errorMessage: payload.error.message
  }))
  .case(actions.updateUser.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.updateUser.done, (state, payload) => ({
    ...state,
    user: payload.result.user,
    isLoading: false
  }))
  .case(actions.updateUser.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    errorMessage: payload.error.message
  }))
  .build();
