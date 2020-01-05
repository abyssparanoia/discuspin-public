import firebase from 'firebase'
import { User } from './user'
import { buildThreadReference } from './thread'

export interface Message {
  id: string
  userID: string
  user: User
  threadID: string
  body: string
  enabled: boolean
  createdAt: number
  updatedAt: number
}

export const buildMessage = (documentID: string, data: firebase.firestore.DocumentData, user: User): Message => ({
  id: documentID,
  userID: data.userID,
  user,
  threadID: data.threadID,
  body: data.body,
  enabled: data.enabled,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
})

export const buildMessageCollectionPath = ({ db, threadID }: { db: firebase.firestore.Firestore; threadID: string }) =>
  buildThreadReference({ db, threadID }).collection('messages')

export const buildMessageReference = ({
  db,
  threadID,
  messageID
}: {
  db: firebase.firestore.Firestore
  threadID: string
  messageID: string
}) => buildMessageCollectionPath({ db, threadID }).doc(messageID)
