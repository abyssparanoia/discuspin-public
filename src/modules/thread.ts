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
  fetchThread: actionCreator.async<void, { thread: Thread }, Error>('FEATCH_THREAD'),
  editThread: actionCreator.async<void, void, Error>('EDIT_THREAD'),
  deleteThread: actionCreator.async<void, void, Error>('DELETE_THREAD'),
  watchThreadList: actionCreator.async<void, { list: Thread[] }, Error>('WATCH_THREAD_LIST'),
  unWatchThreadList: actionCreator<void>('UNWATCH_THREAD_LIST'),
  setChannleUnsubscribe: actionCreator<{ unsubscriber: () => void }>('SET_THREAD_UNSUBSCRIBE'),
  setThread: actionCreator<{ thread: Thread }>('SET_THREAD')
}

export interface State {
  currenThread?: Thread
  list: Thread[]
  isLoading: boolean
  error?: Error
  unsubscriber?: () => void
}

export interface CreateThreadInput {
  title: string
  description: string
}

export interface EditThreadInput {
  title: string
  description: string
}

export interface WatchThreadListInput {
  channelID: string
}

const initialState: State = {
  list: [],
  isLoading: false,
  unsubscriber: undefined
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

export const watchThreadList = ({ channelID }: WatchThreadListInput) => (
  dispatch: Dispatch,
  getState: () => ReduxStore
) => {
  dispatch(actions.watchThreadList.started())
  const unsubscriber = buildThreadCollectionPath({ db })
    .where('enabled', '==', true)
    .where('channelID', '==', channelID)
    .orderBy('createdAt', 'asc')
    .onSnapshot(
      qsnp => {
        const list = getState().thread.list.filter(item => item.channelID === channelID)
        qsnp.docChanges().forEach(({ type, doc }) => {
          switch (type) {
            //- 追加時
            case 'added':
              list.push(buildThread(doc.id, doc.data()))
              break
            //- 変更時
            case 'modified': {
              const index = list.findIndex(item => item.id === doc.id)
              list[index] = buildThread(doc.id, doc.data())
              break
            }
            //- 削除時
            case 'removed': {
              const index = list.findIndex(item => item.id === doc.id)
              if (index && index !== -1) list.splice(index, 1)
              break
            }
          }
        })

        const set = new Set()
        const newList = list.filter(channel => {
          if (!set.has(channel.id)) {
            set.add(channel.id)
            return true
          }
          return false
        })
        newList.sort((a, b) => a.createdAt - b.createdAt)
        dispatch(actions.watchThreadList.done({ result: { list: newList } }))
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

export const fetchThread = (threadID: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(actions.fetchThread.started())
    const thread = await repositories.fetchThread(threadID)
    dispatch(actions.fetchThread.done({ result: { thread } }))
  } catch (error) {
    dispatch(actions.fetchThread.failed({ error }))
  }
}

export const editThread = ({ threadID, title, description }: EditThreadInput & { threadID: string }) => async (
  dispatch: Dispatch,
  _: () => ReduxStore
) => {
  dispatch(actions.editThread.started())
  try {
    const thread = await repositories.editThread({ threadID, title, description })
    dispatch(actions.setThread({ thread }))
    dispatch(actions.editThread.done({}))
  } catch (error) {
    dispatch(actions.editThread.failed({ error }))
  }
}

export const deleteThread = (threadID: string) => async (dispatch: Dispatch) => {
  dispatch(actions.deleteThread.started())
  try {
    const channelID = await repositories.deleteThread(threadID)
    Router.push(`/channels/[channelID]/threads`, `/channels/${channelID}/threads`)
    dispatch(actions.deleteThread.done({}))
  } catch (error) {
    dispatch(actions.deleteThread.failed({ error }))
  }
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
  // watch thread
  .case(actions.watchThreadList.started, state => ({
    ...state,
    isLoading: true,
    error: undefined
  }))
  .case(actions.watchThreadList.done, (state, payload) => ({
    ...state,
    isLoading: false,
    list: payload.result.list
  }))
  .case(actions.watchThreadList.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    error: payload.error
  }))
  // set channel
  .case(actions.setChannleUnsubscribe, (state, payload) => ({
    ...state,
    unsubscriber: payload.unsubscriber
  }))
  .case(actions.unWatchThreadList, state => ({
    ...state,
    unsubscriber: undefined
  }))
  // fetch thread
  .case(actions.fetchThread.started, state => ({
    ...state,
    isLoading: true,
    error: undefined
  }))
  .case(actions.fetchThread.done, (state, payload) => ({
    ...state,
    isLoading: false,
    currenThread: payload.result.thread
  }))
  .case(actions.fetchThread.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    error: payload.error
  }))
  // edit thread
  .case(actions.editThread.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.editThread.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.editThread.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    error: payload.error
  }))
  // delete thread
  .case(actions.deleteThread.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.deleteThread.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.deleteThread.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    error: payload.error
  }))
  .case(actions.setThread, (state, payload) => ({
    ...state,
    currenThread: payload.thread
  }))
