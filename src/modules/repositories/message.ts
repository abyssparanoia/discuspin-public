import { db } from 'src/firebase/client'
import { Message, buildMessageReference, buildMessage } from 'src/modules/entities'
import moment from 'moment'
import { fetchUser } from './user'

// メッセージ単体を取得する
export const fetchMessage = async ({
  id,
  threadID
}: {
  id: string
  threadID: string
}): Promise<Message | undefined> => {
  const ref = buildMessageReference({ db, threadID, messageID: id })
  const doc = await ref.get().catch(error => {
    throw new Error(`firestoreからの取得に失敗しました [${error}]`)
  })

  if (!doc.exists) return undefined

  const user = await fetchUser(doc.data()!.userID)
  return buildMessage(doc.id, doc.data()!, user!)
}

// 返信も含めて取得する
export const fetchMessageWithReply = async ({ id, threadID }: { id: string; threadID: string }) => {
  const message = await fetchMessage({ id, threadID })
  if (message && message.replyID) {
    message.reply = await fetchMessage({ id: message.replyID, threadID })
  }
  return message
}

export const createMessage = async ({
  body,
  threadID,
  userID,
  replyID
}: {
  body: string
  threadID: string
  userID: string
  replyID?: string
}) => {
  const newDoc = db
    .collection('threads')
    .doc(threadID)
    .collection('messages')
    .doc()

  let data: Omit<Message, 'user'> = {
    id: newDoc.id,
    body,
    userID,
    threadID,
    replyID: replyID || '',
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
  messageID,
  replyID
}: {
  body: string
  threadID: string
  messageID: string
  replyID?: string
}) => {
  const ref = db
    .collection('threads')
    .doc(threadID)
    .collection('messages')
    .doc(messageID)

  const data: { body: string; replyID?: string; updatedAt: number } = {
    body,
    updatedAt: +moment().format('X')
  }

  if (replyID) data.replyID = replyID

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
