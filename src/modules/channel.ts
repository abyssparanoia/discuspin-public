import actionCreatorFactory from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Dispatch } from 'redux'
import { Channel, buildChannelCollectionPath, buildChannel } from 'src/modules/entities'
import * as repositories from 'src/modules/repositories'
import { db } from 'src/firebase/client'
import Router from 'next/router'
import { ReduxStore } from './reducer'
import { addError } from './error'

const actionCreator = actionCreatorFactory('channel')
export const actions = {
  createChannel: actionCreator.async<void, void, Error>('CREATE_CHANNEL'),
  editChannel: actionCreator.async<void, void, Error>('EDIT_CHANNEL'),
  deleteChannel: actionCreator.async<void, void, Error>('DELETE_CHANNEL'),
  watchChannelList: actionCreator.async<void, { list: Channel[] }, Error>('WATCH_CHANNEL_LIST'),
  unWatchChannelList: actionCreator<void>('UNWATCH_CHANNEL_LIST'),
  setChannleUnsubscribe: actionCreator<{ unsubscriber: () => void }>('SET_CHANNEL_UNSUBSCRIBE')
}

export interface State {
  list: Channel[]
  isLoading: boolean
  error?: Error
  unsubscriber?: () => void
}

const initialState: State = {
  list: [],
  isLoading: false,
  unsubscriber: undefined
}

export interface CreateChannelInput {
  title: string
  description: string
}

export interface EditChannelInput {
  title: string
  description: string
}

export const createChannel = (values: CreateChannelInput) => async (dispatch: Dispatch) => {
  try {
    dispatch(actions.createChannel.started())
    const channelID = await repositories.createChannel(values)
    Router.push(`/channels/[channelID]/threads`, `/channels/${channelID}/threads`)
    dispatch(actions.createChannel.done({}))
  } catch (error) {
    dispatch(actions.createChannel.failed({ error }))
    dispatch(addError(error))
  }
}

export const editChannel = (channelID: string, values: EditChannelInput) => async (dispatch: Dispatch) => {
  try {
    dispatch(actions.editChannel.started())
    repositories.editChannel({ channelID, title: values.title, description: values.description })
    dispatch(actions.editChannel.done({}))
  } catch (error) {
    dispatch(actions.editChannel.failed({ error }))
  }
}

export const deleteChannel = (channelID: string) => async (dispatch: Dispatch, _: () => ReduxStore) => {
  dispatch(actions.deleteChannel.started())
  try {
    await repositories.deleteChannel({ channelID })
    dispatch(actions.deleteChannel.done({}))
  } catch (error) {
    dispatch(actions.deleteChannel.failed({ error }))
  }
}

export const watchChannelList = () => (dispatch: Dispatch, getState: () => ReduxStore) => {
  dispatch(actions.watchChannelList.started())
  const unsubscriber = buildChannelCollectionPath({ db })
    .where('enabled', '==', true)
    .orderBy('createdAt', 'asc')
    .onSnapshot(
      qsnp => {
        const list = getState().channel.list
        qsnp.docChanges().forEach(({ type, doc }) => {
          switch (type) {
            //- 追加時
            case 'added':
              list.push(buildChannel(doc.id, doc.data()))
              break
            //- 変更時
            case 'modified': {
              const index = list.findIndex(item => item.id === doc.id)
              list[index] = buildChannel(doc.id, doc.data())
              break
            }
            //- 削除時
            case 'removed': {
              const index = list.findIndex(item => item.id === doc.id)
              list.splice(index, 1)
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

        dispatch(actions.watchChannelList.done({ result: { list: newList } }))
      },
      error => {
        dispatch(actions.watchChannelList.failed({ error }))
        dispatch(addError(error))
      }
    )
  actions.setChannleUnsubscribe({ unsubscriber })
}

export const unWatchChannelList = () => (dispatch: Dispatch, getState: () => ReduxStore) => {
  const { unsubscriber } = getState().channel
  if (unsubscriber) {
    unsubscriber()
  }
  dispatch(actions.unWatchChannelList())
}

export const reducer = reducerWithInitialState(initialState)
  .case(actions.createChannel.started, state => ({
    ...state,
    isLoading: true,
    error: undefined
  }))
  .case(actions.createChannel.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.createChannel.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    error: payload.error
  }))
  .case(actions.editChannel.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.editChannel.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.editChannel.failed, (state, payload) => ({
    ...state,
    error: payload.error,
    isLoading: false
  }))
  .case(actions.watchChannelList.started, state => ({
    ...state,
    error: undefined
  }))
  .case(actions.watchChannelList.done, (state, payload) => ({
    ...state,
    list: payload.result.list
  }))
  .case(actions.watchChannelList.failed, (state, payload) => ({
    ...state,
    error: payload.error
  }))
  .case(actions.setChannleUnsubscribe, (state, payload) => ({
    ...state,
    unsubscriber: payload.unsubscriber
  }))
  .case(actions.unWatchChannelList, state => ({
    ...state,
    unsubscriber: undefined
  }))
