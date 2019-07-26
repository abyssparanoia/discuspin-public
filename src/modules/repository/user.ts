import { db, auth } from "../firebase";
import { User, buildUser } from "../entity/user";
import moment from "moment";

// 自分の情報を取得する
export const fetchMe = async () => {
  if (!auth.currentUser) return undefined;
  const id = auth.currentUser.uid;
  const doc = await db
    .collection("users")
    .doc(id)
    .get();
  if (!doc.exists) return undefined;
  return buildUser(doc.id, doc.data()!);
};

export const fetchUser = async (id: string) => {
  if (!auth.currentUser) return undefined;
  const doc = await db
    .collection("users")
    .doc(id)
    .get();
  if (!doc.exists) return undefined;
  return buildUser(doc.id, doc.data()!);
};

// 自分の情報を追加
export const addUser = async (
  id: string,
  displayName: string,
  position?: string,
  description?: string,
  avatarURL?: string
) => {
  const timestamp = moment().format("X");
  const data: User = {
    id: id,
    displayName: displayName,
    position: position,
    description: description,
    avatarURL: avatarURL || "aaaaaaaaaaaa",
    createdAt: +timestamp,
    updatedAt: +timestamp
  };
  try {
    await db
      .collection("users")
      .doc(id)
      .set(data);
    return data;
  } catch (error) {
    throw new Error(`ユーザーの追加に失敗しました${error}`);
  }
};

export const updateUser = async (
  id: string,
  displayName?: string,
  position?: string,
  description?: string,
  avatarURL?: string
) => {
  const timestamp = +moment().format("X");

  // update data 入力
  const data = {
    id: id,
    updatedAt: timestamp,
    displayName: displayName || "名無しさん",
    position: position,
    description: description,
    avatarURL:
      avatarURL ||
      "https://firebasestorage.googleapis.com/v0/b/discuspin.appspot.com/o/images%2Fdefaulticon.png?alt=media&token=d8fd8be0-e11a-441d-9b0b-a806cd563a83"
  };

  // 情報入力
  try {
    await db
      .collection("users")
      .doc(id)
      .update(data);
    return fetchMe();
  } catch (error) {
    throw new Error(`ユーザーの編集に失敗しました${error}`);
  }
};
