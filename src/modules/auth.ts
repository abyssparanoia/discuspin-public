import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { Dispatch } from "redux";
import * as authRepository from "./repository/auth";
import { User } from "firebase";
import { actions as userActions } from "./user";

export interface State {
  authUser?: User;
  isLoadingRefresh: boolean;
  isLoadingSignIn: boolean;
  isLoadingSignOut: boolean;
  errorMessage?: string;
}

const initialState: State = {
  isLoadingSignIn: false,
  isLoadingRefresh: false,
  isLoadingSignOut: false
};

const actionCreator = actionCreatorFactory("auth");

export const actions = {
  refreshAuthUID: actionCreator.async<
    void,
    { authUser?: User },
    { message?: string }
  >("REFRESH_AUTH_UID"),
  signIn: actionCreator.async<void, { authUser?: User }, { message?: string }>(
    "SIGN_IN_WITH_GOOGLE"
  ),
  signOut: actionCreator.async<void, void, { message?: string }>("SIGN_OUT")
};

export const refreshAuthUID = () => (dispatch: Dispatch) => {
  dispatch(actions.refreshAuthUID.started());
  return authRepository.auth.onIdTokenChanged(
    authUser => {
      dispatch(
        actions.refreshAuthUID.done({
          result: { authUser: authUser ? authUser : undefined }
        })
      );
    },
    error => {
      dispatch(
        actions.refreshAuthUID.failed({
          error: { message: `認証情報の取得に失敗しました[${error}]` }
        })
      );
    }
  );
};

export const signIn = () => (dispatch: Dispatch) => {
  dispatch(actions.signIn.started());
  return authRepository
    .signInWithGoogle()
    .then(userCredential =>
      dispatch(
        actions.signIn.done({
          result: {
            authUser: userCredential.user ? userCredential.user : undefined
          }
        })
      )
    )
    .catch(_ =>
      dispatch(
        actions.signIn.failed({
          error: { message: "ログインに失敗しました" }
        })
      )
    );
};

export const signOut = () => async (dispatch: Dispatch) => {
  dispatch(actions.signOut.started());
  dispatch(userActions.unWatchUser());
  await authRepository
    .signOut()
    .then(() => {
      dispatch(actions.signOut.done({}));
    })
    .catch(error => {
      dispatch(
        actions.signOut.failed({
          error: { message: `ログアウトに失敗しました。[${error}]` }
        })
      );
    });
};

export const reducer = reducerWithInitialState(initialState)
  .case(actions.refreshAuthUID.started, state => ({
    ...state,
    isLoadingRefresh: true
  }))
  .case(actions.refreshAuthUID.done, (state, payload) => ({
    ...state,
    isLoadingRefresh: false,
    authUser: payload.result.authUser
  }))
  .case(actions.refreshAuthUID.failed, (state, payload) => ({
    ...state,
    isLoadingRefresh: false,
    errorMessage: payload.error.message
  }))
  .case(actions.signIn.started, state => ({
    ...state,
    isLoadingSignIn: true
  }))
  .case(actions.signIn.done, (state, paylaod) => ({
    ...state,
    isLoadingSignIn: false,
    authUser: paylaod.result.authUser
  }))
  .case(actions.signIn.failed, (state, paylaod) => ({
    ...state,
    isLoadingSignIn: false,
    errorMessage: paylaod.error.message
  }))
  .case(actions.signOut.started, state => ({
    ...state,
    isLoadingSignOut: true
  }))
  .case(actions.signOut.done, state => ({
    ...state,
    isLoadingSignOut: false,
    authUser: undefined
  }))
  .case(actions.signOut.failed, (state, payload) => ({
    ...state,
    authUser: undefined,
    isLoadingSignOut: false,
    errorMessage: payload.error.message
  }))
  .build();
