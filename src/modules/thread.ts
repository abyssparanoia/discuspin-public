import actionCreatorFactory from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Dispatch } from 'redux'
import { Thread, buildThreadCollectionPath, buildThread } from 'src/modules/entities'
import * as repositories from 'src/modules/repositories'
import { db } from 'src/firebase/client'
import Router from 'next/router'
import { ReduxStore } from './reducer'
import { addError } from './error'

const actionCreator = actionCreatorFactory('thread')
export const actions = {
  createThread: actionCreator.async<void, void, Error>('CREATE_THREAD'),
  watchThreadList: actionCreator.async<void, { list: Thread[] }, Error>('WATCH_THREAD_LIST'),
  unWatchThreadList: actionCreator<void>('UNWATCH_THREAD_LIST'),
  setChannleUnsubscribe: actionCreator<{ unsubscriber: () => void }>('SET_THREAD_UNSUBSCRIBE')
}

export interface State {
  list: Thread[]
  isLoading: boolean
  error?: Error
  unsubscriber?: () => void
}

const initialState: State = {
  list: [],
  isLoading: false,
  unsubscriber: undefined
}

export interface CreateThreadInput {
  title: string
  description: string
}

export const createThread = (values: CreateThreadInput, channelID: string) => async (
  dispatch: Dispatch,
  getState: () => ReduxStore
) => {
  try {
    dispatch(actions.createThread.started())
    const userID = getState().auth.credential!.uid
    const threadID = await repositories.createThread({ ...values, channelID, userID })
    Router.push(
      `/channels/[channelID]/threads/[threadID]/messages`,
      `/channels/${channelID}/threads/${threadID}/messages`
    )
    dispatch(actions.createThread.done({}))
  } catch (error) {
    dispatch(actions.createThread.failed({ error }))
    dispatch(addError(error))
  }
}

export interface WatchThreadListInput {
  channelID: string
}

export const watchThreadList = ({ channelID }: WatchThreadListInput) => (
  dispatch: Dispatch,
  getState: () => ReduxStore
) => {
  dispatch(actions.watchThreadList.started())
  const unsubscriber = buildThreadCollectionPath({ db })
    .where('channelID', '==', channelID)
    .onSnapshot(
      qsnp => {
        const currentThreadList = getState().thread.list
        const newThreadList = qsnp.docs.map(dsnp => buildThread(dsnp.id, dsnp.data()))

        const set = new Set()
        const mergedThreadList = [...currentThreadList, ...newThreadList]
          .filter(Thread => {
            if (!set.has(Thread.id)) {
              set.add(Thread.id)
              return true
            }
            return false
          })
          .sort((a, b) => b.updatedAt - a.updatedAt)

        dispatch(actions.watchThreadList.done({ result: { list: mergedThreadList } }))
      },
      error => {
        dispatch(actions.watchThreadList.failed({ error }))
        dispatch(addError(error))
      }
    )
  actions.setChannleUnsubscribe({ unsubscriber })
}

export const unWatchThreadList = () => (dispatch: Dispatch, getState: () => ReduxStore) => {
  const { unsubscriber } = getState().thread
  if (unsubscriber) {
    unsubscriber()
  }
  dispatch(actions.unWatchThreadList())
}

export const reducer = reducerWithInitialState(initialState)
  .case(actions.createThread.started, state => ({
    ...state,
    isLoading: true,
    error: undefined
  }))
  .case(actions.createThread.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.createThread.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    error: payload.error
  }))
  .case(actions.watchThreadList.started, state => ({
    ...state,
    list: [],
    error: undefined
  }))
  .case(actions.watchThreadList.done, (state, payload) => ({
    ...state,
    list: payload.result.list
  }))
  .case(actions.watchThreadList.failed, (state, payload) => ({
    ...state,
    error: payload.error
  }))
  .case(actions.setChannleUnsubscribe, (state, payload) => ({
    ...state,
    unsubscriber: payload.unsubscriber
  }))
  .case(actions.unWatchThreadList, state => ({
    ...state,
    unsubscriber: undefined
  }))
