import firebase from "firebase";

export interface Channel {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export const buildChannel = (
  documentID: string,
  data: firebase.firestore.DocumentData
): Channel => ({
  id: documentID,
  title: data.title,
  description: data.description,
  enabled: data.enabled,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
});
