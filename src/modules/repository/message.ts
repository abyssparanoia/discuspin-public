import { db } from "../firebase";
import moment from "moment";

// チャンネルを追加する
export const createMessage = async (
  threadId: string,
  userId: string,
  body: string
) => {
  const newDoc = db
    .collection("threads")
    .doc(threadId)
    .collection("messages")
    .doc();
  const data = {
    id: newDoc.id,
    body: body,
    enabled: true,
    threadID: threadId,
    userID: userId,
    createdAt: +moment().format("X"),
    updatedAt: +moment().format("X")
  };
  await newDoc.set(data).catch(error => {
    throw new Error(`firestoreへの投稿に失敗しました [${error}]`);
  });

  return data;
};
