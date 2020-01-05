import firebase from 'firebase'

export interface Thread {
  id: string
  title: string
  description: string
  userID: string
  channelID: string
  enabled: boolean
  createdAt: number
  updatedAt: number
}

export const buildThread = (documentID: string, data: firebase.firestore.DocumentData): Thread => ({
  id: documentID,
  title: data.title,
  description: data.description,
  userID: data.userID,
  channelID: data.channelID,
  enabled: data.enabled,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
})

export const buildThreadCollectionPath = ({ db }: { db: firebase.firestore.Firestore }) => db.collection('threads')

export const buildThreadReference = ({ db, threadID }: { db: firebase.firestore.Firestore; threadID: string }) =>
  buildThreadCollectionPath({ db }).doc(threadID)
