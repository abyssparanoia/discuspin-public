import firebase from "firebase";
import { User } from "./user";
import { fetchUser } from "../repository/user";

export interface Message {
  id: string;
  userID: string;
  user: User;
  threadID: string;
  body: string;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export const buildMessage = async (
  documentID: string,
  data: firebase.firestore.DocumentData
): Promise<Message> => {
  const user = await fetchUser(data.userID);
  return {
    id: documentID,
    userID: data.userID,
    user: user!,
    threadID: data.threadID,
    body: data.body,
    enabled: data.enabled,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};
