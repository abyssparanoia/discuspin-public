import { db } from "../firebase";
import { buildChannel, Channel } from "../entity/channel";
import moment from "moment";

// チャンネルを取得する
export const getChannels = async () => {
  const qsnp = await db
    .collection("channels")
    .orderBy("createdAt", "desc")
    .get()
    .catch(error => {
      throw new Error(`firestoreからのデータ取得に失敗しました [${error}]`);
    });
  return qsnp.docs.map(doc => buildChannel(doc.id, doc.data()));
};

// チャンネルを追加する
export const addChannel = async (name: string, description: string) => {
  const newDoc = db.collection("channels").doc();
  const data: Channel = {
    id: newDoc.id,
    title: name,
    description: description,
    enabled: true,
    createdAt: +moment().format("X"),
    updatedAt: +moment().format("X")
  };
  await newDoc.set(data).catch(error => {
    throw new Error(`firestoreへの投稿に失敗しました [${error}]`);
  });

  return newDoc.id;
};
