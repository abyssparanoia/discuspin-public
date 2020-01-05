import firebase from 'firebase'

export interface User {
  id: string
  displayName: string
  avatarURL: string
  position?: string
  description?: string
  updatedAt: number
  createdAt: number
}

export const buildUser = (documentID: string, data: firebase.firestore.DocumentData): User => ({
  id: documentID,
  displayName: data.displayName,
  description: data.description,
  avatarURL: data.avatarURL,
  position: data.position!,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
})

export const buildUserCollectionPath = ({ db }: { db: firebase.firestore.Firestore }) => db.collection('users')

export const buildUserReference = ({ db, userID }: { db: firebase.firestore.Firestore; userID: string }) =>
  buildUserCollectionPath({ db }).doc(userID)
