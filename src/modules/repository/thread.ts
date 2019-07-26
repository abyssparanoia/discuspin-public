import { db } from "../firebase";
import { Thread, buildThread } from "../entity/thread";
import moment from "moment";

// スレッドを取得する
export const getThreads = async (channel_id: string) => {
  const qsnp = await db
    .collection("threads")
    .where("channelID", "==", channel_id)
    .orderBy("createdAt", "desc")
    .get()
    .catch(error => {
      throw new Error(`firestoreからのデータ取得に失敗しました [${error}]`);
    });
  return qsnp.docs.map(doc => buildThread(doc.id, doc.data()));
};

// スレッドを追加する
export const addThread = async (
  title: string,
  description: string,
  channel_id: string,
  user_id: string
) => {
  const newDoc = db.collection("threads").doc();
  const data: Thread = {
    id: newDoc.id,
    title: title,
    description: description,
    userID: user_id,
    channelID: channel_id,
    enabled: true,
    createdAt: +moment().format("X"),
    updatedAt: +moment().format("X")
  };
  await newDoc.set(data).catch(error => {
    throw new Error(`firestoreへの投稿に失敗しました [${error}]`);
  });

  return newDoc.id;
};
