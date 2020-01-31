import { Message, buildMessageCollectionPath } from './entities'
import * as repositories from 'src/modules/repositories'
import { db } from 'src/firebase/client'
import actionCreatorFactory from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Dispatch } from 'redux'
import { ReduxStore } from './reducer'

import Router from 'next/router'
import { fetchMessageWithReply } from 'src/modules/repositories'

export interface State {
  list: Message[]
  isLoading: boolean
  error?: Error
  imageUrl?: string
  reply?: Message
  unsubsriber?: () => void
}

const initialState: State = {
  list: [],
  isLoading: false
}

export interface CreateMessageInput {
  text: string
}

const actionCreator = actionCreatorFactory('message')
export const actions = {
  createMessage: actionCreator.async<void, void, Error>('CREATE_MESSAGE'),
  editMessage: actionCreator.async<void, void, Error>('EDIT_MESSAGE'),
  deleteMessage: actionCreator.async<void, void, Error>('DELETE_MESSAGE'),
  watchMessageList: actionCreator.async<void, { list: Message[] }, Error>('WATCH_MESSAGE_LIST'),
  unWatchMessageList: actionCreator<void>('UNWATCH_MESSAGE_LIST'),
  setMessageListUnsubscribe: actionCreator<{ unsubscribe: () => void }>('SET_MESSAGE_LIST_UNSUBSCRIBE'),
  uploadImage: actionCreator.async<void, { url: string }, Error>('UPLOAD_IMAGE'),
  setReply: actionCreator<{ reply: Message }>('SET_REPLY'),
  unsetReply: actionCreator<void>('UNSET_REPLY')
}

export const createMessage = (values: CreateMessageInput) => async (dispatch: Dispatch, getState: () => ReduxStore) => {
  try {
    dispatch(actions.createMessage.started())
    const body = values.text
    const userID = getState().auth.credential!.uid
    const replyID = getState().message.reply?.id
    const threadID = Router.query['threadID'].toString()
    await repositories.createMessage({ body, threadID, userID, replyID })
    dispatch(actions.createMessage.done({}))
    dispatch(actions.unsetReply())
  } catch (error) {
    dispatch(actions.createMessage.failed({ error }))
  }
}

export interface WatchThreadListInput {
  threadID: string
}

export const watchMessageList = ({ threadID }: WatchThreadListInput) => (
  dispatch: Dispatch,
  getState: () => ReduxStore
) => {
  dispatch(actions.watchMessageList.started())
  const unsubscribe = buildMessageCollectionPath({ db, threadID })
    .where('enabled', '==', true)
    .orderBy('createdAt', 'asc')
    .onSnapshot(async qsnp => {
      const list = [...getState().message.list]
      const promises: Promise<any>[] = []
      qsnp.docChanges().forEach(({ type, doc }) => {
        switch (type) {
          //- 追加時
          case 'added': {
            promises.push(
              fetchMessageWithReply({ id: doc.id, threadID: doc.data().threadID }).then(message => {
                if (message) list.push(message)
              })
            )
            break
          }
          //- 変更時
          case 'modified': {
            const index = list.findIndex(item => item.id === doc.id)
            promises.push(
              fetchMessageWithReply({ id: doc.id, threadID: doc.data().threadID }).then(message => {
                if (message) list[index] = message
              })
            )
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
      await Promise.all(promises)
      list.sort((a, b) => a.createdAt - b.createdAt)
      dispatch(actions.watchMessageList.done({ result: { list } }))
    })
  actions.setMessageListUnsubscribe({ unsubscribe })
}

export const unWatchMessageList = () => (dispatch: Dispatch, getState: () => ReduxStore) => {
  const unsubscriber = getState().message.unsubsriber
  if (unsubscriber) {
    unsubscriber()
    dispatch(actions.unWatchMessageList())
  }
}

export const uploadImage = (file: File) => async (dispatch: Dispatch, _: () => ReduxStore) => {
  dispatch(actions.uploadImage.started())
  try {
    const url = await repositories.uploadImage(file)
    dispatch(actions.uploadImage.done({ result: { url } }))
  } catch (error) {
    dispatch(actions.uploadImage.failed({ error }))
  }
}

export const editMessage = (threadID: string, messageID: string, text: string) => async (
  dispatch: Dispatch,
  _: () => ReduxStore
) => {
  dispatch(actions.editMessage.started())
  try {
    await repositories.editMessage({ threadID, messageID, body: text })
    dispatch(actions.editMessage.done({}))
  } catch (error) {
    dispatch(actions.editMessage.failed({ error }))
  }
}

export const deleteMessage = (threadID: string, messageID: string) => async (
  dispatch: Dispatch,
  _: () => ReduxStore
) => {
  dispatch(actions.deleteMessage.started())
  try {
    await repositories.deleteMessage({ threadID, messageID })
    dispatch(actions.deleteMessage.done({}))
  } catch (error) {
    dispatch(actions.deleteMessage.failed({ error }))
  }
}

export const setReply = (reply: Message) => async (dispatch: Dispatch) => dispatch(actions.setReply({ reply }))

export const unsetReply = () => async (dispatch: Dispatch) => dispatch(actions.unsetReply())

export const reducer = reducerWithInitialState(initialState)
  .case(actions.createMessage.started, state => ({
    ...state,
    isLoading: true,
    error: undefined
  }))
  .case(actions.createMessage.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.createMessage.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    error: payload.error
  }))
  .case(actions.watchMessageList.started, state => ({
    ...state,
    isLoading: true,
    list: [],
    error: undefined
  }))
  .case(actions.watchMessageList.done, (state, payload) => ({
    ...state,
    isLoading: false,
    list: payload.result.list
  }))
  .case(actions.watchMessageList.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    error: payload.error
  }))
  .case(actions.unWatchMessageList, state => ({
    ...state,
    unsubsriber: undefined,
    list: []
  }))
  .case(actions.setMessageListUnsubscribe, (state, payload) => ({
    ...state,
    unsubsriber: payload.unsubscribe
  }))
  .case(actions.uploadImage.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.uploadImage.done, (state, payload) => ({
    ...state,
    isLoading: false,
    imageUrl: payload.result.url
  }))
  .case(actions.uploadImage.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    error: payload.error
  }))
  .case(actions.editMessage.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.editMessage.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.editMessage.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    error: payload.error
  }))
  .case(actions.deleteMessage.started, state => ({
    ...state,
    isLoading: true
  }))
  .case(actions.deleteMessage.done, state => ({
    ...state,
    isLoading: false
  }))
  .case(actions.deleteMessage.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    error: payload.error
  }))
  .case(actions.setReply, (state, payload) => ({
    ...state,
    reply: payload.reply
  }))
  .case(actions.unsetReply, state => ({
    ...state,
    reply: undefined
  }))
