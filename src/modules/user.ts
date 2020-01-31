import actionCreatorFactory from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Dispatch } from 'redux'
import * as repository from './repositories'
import { User } from './entities'
import { ReduxStore } from './reducer'

const actionCreator = actionCreatorFactory('user')

export const actions = {
  fetchMe: actionCreator.async<void, { me: User }, Error>('FETCH_ME'),
  fetchMeOnServer: actionCreator.async<void, { me: User }, Error>('FETCH_ME_ON_SERVER'),
  updateMe: actionCreator.async<void, void, Error>('UPDATE_ME'),
  uploadImage: actionCreator.async<void, { url: string }, Error>('UPLOAD_IMAGE'),
  setMe: actionCreator<{ result: { user: User } }>('SET_ME'),
  unsetImage: actionCreator<void>('UNSET_IMAGE')
}

export interface State {
  me?: User
  isLoading: boolean
  imageURL?: string
  error?: Error
}

export interface EditUser {
  displayName?: string
  description?: string
  position?: string
  avatarURL?: string
}

const initialState: State = {
  me: undefined,
  isLoading: false
}

export const fetchMe = () => async (dispatch: Dispatch) => {
  dispatch(actions.fetchMe.started())
  try {
    const user = await repository.fetchMe()
    if (user) {
      dispatch(actions.fetchMe.done({ result: { me: user } }))
    } else {
      dispatch(actions.fetchMe.failed({ error: new Error('not exist') }))
    }
  } catch (error) {
    dispatch(actions.fetchMe.failed({ error }))
  }
}

export const uploadImage = (file: File) => async (dispatch: Dispatch, _: () => ReduxStore) => {
  dispatch(actions.uploadImage.started())
  try {
    const url = await repository.uploadImage(file)
    dispatch(actions.uploadImage.done({ result: { url } }))
  } catch (error) {
    dispatch(actions.uploadImage.failed({ error }))
  }
}

export const updateMe = (data: EditUser) => async (dispatch: Dispatch, _: () => ReduxStore) => {
  dispatch(actions.updateMe.started())
  try {
    const user = await repository.updateMe(data.displayName, data.position, data.description, data.avatarURL)
    dispatch(actions.setMe({ result: { user } }))
    dispatch(actions.updateMe.done({}))
    dispatch(actions.unsetImage())
  } catch (error) {
    dispatch(actions.updateMe.failed({ error }))
  }
}

export const setMe = (user: User) => (dispatch: Dispatch) => {
  dispatch(actions.setMe({ result: { user } }))
}

export const unsetImage = () => (dispatch: Dispatch) => dispatch(actions.unsetImage())

export const reducer = reducerWithInitialState(initialState)
  .case(actions.fetchMe.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.fetchMe.done, (state, payload) => ({
    ...state,
    me: payload.result.me,
    isLoading: false
  }))
  .case(actions.fetchMe.failed, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.updateMe.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.updateMe.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.updateMe.failed, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.setMe, (state, payload) => ({
    ...state,
    me: payload.result.user
  }))
  .case(actions.uploadImage.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.uploadImage.done, (state, payload) => ({
    ...state,
    imageURL: payload.result.url,
    isLoading: false
  }))
  .case(actions.uploadImage.failed, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.unsetImage, state => ({
    ...state,
    imageURL: undefined
  }))
