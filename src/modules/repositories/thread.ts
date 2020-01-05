import { db } from 'src/firebase/client'
import { Thread } from 'src/modules/entities'
import moment from 'moment'

export const createThread = async ({
  title,
  description,
  channelID,
  userID
}: {
  title: string
  description: string
  channelID: string
  userID: string
}) => {
  const newDoc = db.collection('threads').doc()
  const data: Thread = {
    id: newDoc.id,
    title,
    description,
    userID,
    channelID,
    enabled: true,
    createdAt: +moment().format('X'),
    updatedAt: +moment().format('X')
  }
  await newDoc.set(data).catch(error => {
    throw new Error(`firestoreへの投稿に失敗しました [${error}]`)
  })

  return newDoc.id
}
