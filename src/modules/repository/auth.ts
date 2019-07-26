import { firebase } from "../firebase";

export const auth = firebase.auth();

export const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(provider);
};

export const signOut = () => auth.signOut();

export const getIdTokenResult = () => auth.currentUser!.getIdTokenResult();
