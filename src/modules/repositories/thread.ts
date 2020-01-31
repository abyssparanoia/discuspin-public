import { db } from 'src/firebase/client'
import { Thread, buildThread } from 'src/modules/entities'
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

export const fetchThread = async (threadID: string) => {
  const ref = db.collection('threads').doc(threadID)
  const dsnp = await ref.get()
  if (dsnp.exists) {
    return buildThread(threadID, dsnp.data()!)
  } else {
    throw new Error(`${threadID} is not found`)
  }
}

export const editThread = async ({
  threadID,
  title,
  description
}: {
  threadID: string
  title: string
  description: string
}) => {
  const ref = db.collection('threads').doc(threadID)
  const dsnp = await ref.get()
  if (dsnp.exists) {
    const thread = buildThread(dsnp.id, dsnp.data()!)
    const data: { title: string; description: string; updatedAt: number } = {
      title,
      description,
      updatedAt: +moment().format('X')
    }

    await ref.update(data).catch(error => {
      throw new Error(`firestoreへの投稿に失敗しました [${error}]`)
    })

    return { ...thread, title, description }
  } else {
    throw new Error(`${threadID} is not found`)
  }
}

export const deleteThread = async (threadID: string) => {
  const ref = db.collection('threads').doc(threadID)
  const dsnp = await ref.get()
  if (dsnp.exists) {
    const thread = buildThread(dsnp.id, dsnp.data()!)
    const data: { enabled: boolean; updatedAt: number } = {
      enabled: false,
      updatedAt: +moment().format('X')
    }

    await ref.update(data).catch(error => {
      throw new Error(`firestoreへの投稿に失敗しました [${error}]`)
    })

    return thread.channelID
  } else {
    throw new Error(`${threadID} is not found`)
  }
}
