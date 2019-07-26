import firebase from "firebase";

export interface User {
  id: string;
  displayName: string;
  avatarURL: string;
  position?: string;
  description?: string;
  updatedAt: number;
  createdAt: number;
}

export const buildUser = (
  documentID: string,
  data: firebase.firestore.DocumentData
): User => ({
  id: documentID,
  displayName: data.displayName,
  description: data.description,
  avatarURL: data.avatarURL,
  position: data.position!,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
});
