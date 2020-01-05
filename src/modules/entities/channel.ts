import firebase from 'firebase'

export interface Channel {
  id: string
  title: string
  description: string
  enabled: boolean
  createdAt: number
  updatedAt: number
}

export const buildChannel = (documentID: string, data: firebase.firestore.DocumentData): Channel => ({
  id: documentID,
  title: data.title,
  description: data.description,
  enabled: data.enabled,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
})

export const buildChannelCollectionPath = ({ db }: { db: firebase.firestore.Firestore }) => db.collection('channels')
export const buildChannelReference = ({ db, channelID }: { db: firebase.firestore.Firestore; channelID: string }) =>
  buildChannelCollectionPath({ db }).doc(channelID)
