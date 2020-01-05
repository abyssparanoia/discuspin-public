import { db } from 'src/firebase/client'
import { Message } from 'src/modules/entities'
import moment from 'moment'

export const createMessage = async ({ body, threadID, userID }: { body: string; threadID: string; userID: string }) => {
  const newDoc = db
    .collection('threads')
    .doc(threadID)
    .collection('messages')
    .doc()

  const data: Omit<Message, 'user'> = {
    id: newDoc.id,
    body,
    userID,
    threadID,
    enabled: true,
    createdAt: +moment().format('X'),
    updatedAt: +moment().format('X')
  }
  await newDoc.set(data).catch(error => {
    throw new Error(`firestoreへの投稿に失敗しました [${error}]`)
  })

  return newDoc.id
}

export const editMessage = async ({
  body,
  threadID,
  messageID
}: {
  body: string
  threadID: string
  messageID: string
}) => {
  const ref = db
    .collection('threads')
    .doc(threadID)
    .collection('messages')
    .doc(messageID)

  const data: { body: string; updatedAt: number } = {
    body,
    updatedAt: +moment().format('X')
  }

  await ref.update(data).catch(error => {
    throw new Error(`firestoreへの投稿に失敗しました [${error}]`)
  })
}

export const deleteMessage = async ({ threadID, messageID }: { threadID: string; messageID: string }) => {
  const ref = db
    .collection('threads')
    .doc(threadID)
    .collection('messages')
    .doc(messageID)
  const data: { enabled: boolean; updatedAt: number } = {
    enabled: false,
    updatedAt: +moment().format('X')
  }

  await ref.update(data).catch(error => {
    throw new Error(`firestoreへの投稿に失敗しました [${error}]`)
  })
}
