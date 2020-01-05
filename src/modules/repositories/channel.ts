import { db } from 'src/firebase/client'
import { Channel } from 'src/modules/entities'
import moment from 'moment'

export const createChannel = async ({ title, description }: { title: string; description: string }) => {
  const newDoc = db.collection('channels').doc()
  const data: Channel = {
    id: newDoc.id,
    title,
    description,
    enabled: true,
    createdAt: +moment().format('X'),
    updatedAt: +moment().format('X')
  }
  await newDoc.set(data).catch(error => {
    throw new Error(`firestoreへの投稿に失敗しました [${error}]`)
  })

  return newDoc.id
}

export const editChannel = async ({
  channelID,
  title,
  description
}: {
  channelID: string
  title: string
  description: string
}) => {
  const ref = db.collection('channels').doc(channelID)
  const data = {
    title,
    description
  }

  await ref.update(data).catch(error => {
    throw new Error(`チャンネルの編集に失敗しました [${error}]`)
  })

  return ref.id
}

export const deleteChannel = async ({ channelID }: { channelID: string }) => {
  const ref = db.collection('channels').doc(channelID)
  const data: { enabled: boolean; updatedAt: number } = {
    enabled: false,
    updatedAt: +moment().format('X')
  }

  await ref.update(data).catch(error => {
    throw new Error(`firestoreへの投稿に失敗しました [${error}]`)
  })
}
