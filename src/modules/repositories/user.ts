import { db, auth } from 'src/firebase/client'
import { User, buildUser, buildUserReference } from 'src/modules/entities'
import moment from 'moment'
import { createSession } from './auth'

export const fetchMe = async (): Promise<User | undefined> => {
  if (!auth.currentUser) return undefined
  const userID = auth.currentUser.uid
  const doc = await buildUserReference({ db, userID }).get()
  if (!doc.exists) return undefined
  return buildUser(doc.id, doc.data()!)
}

export const fetchUser = async (userID: string): Promise<User | undefined> => {
  const doc = await buildUserReference({ db, userID }).get()
  if (!doc.exists) return undefined
  return buildUser(doc.id, doc.data()!)
}

export const fetchUserOrFail = async (userID: string): Promise<User> => {
  const doc = await buildUserReference({ db, userID }).get()
  if (!doc.exists) throw new Error('ユーザーが見つかりませんでした')
  return buildUser(doc.id, doc.data()!)
}

export const fetchUserOnServer = async (
  firestore: FirebaseFirestore.Firestore,
  userID: string
): Promise<User | undefined> => {
  const doc = await firestore
    .collection('users')
    .doc(userID)
    .get()
  if (!doc.exists) return undefined
  return buildUser(doc.id, doc.data()!)
}

export const createUser = async (userID: string, displayName?: string, avatarURL?: string) => {
  const timestamp = moment().format('X')
  const data: User = {
    id: userID,
    displayName: displayName || 'ゲストさん',
    position: '学生',
    description: '',
    avatarURL:
      avatarURL ||
      'https://firebasestorage.googleapis.com/v0/b/discuspin.appspot.com/o/images%2Fdefaulticon.png?alt=media&token=d8fd8be0-e11a-441d-9b0b-a806cd563a83',
    createdAt: +timestamp,
    updatedAt: +timestamp
  }
  await buildUserReference({ db, userID })
    .set(data)
    .catch(error => {
      throw new Error(`ユーザーの追加に失敗しました${error}`)
    })

  await auth.currentUser!.updateProfile({
    displayName: displayName || 'ゲストさん',
    photoURL:
      avatarURL ||
      'https://firebasestorage.googleapis.com/v0/b/discuspin.appspot.com/o/images%2Fdefaulticon.png?alt=media&token=d8fd8be0-e11a-441d-9b0b-a806cd563a83'
  })

  return data
}

export const updateMe = async (
  displayName?: string,
  position?: string,
  description?: string,
  avatarURL?: string
): Promise<User> => {
  if (!auth.currentUser) throw new Error('未認証です')
  const userID = auth.currentUser.uid

  const user = await fetchUserOrFail(userID)

  const timestamp = +moment().format('X')

  const data: Omit<User, 'id' | 'createdAt'> = {
    updatedAt: timestamp,
    displayName: displayName || user.displayName,
    position: position || user.position,
    description: description || user.description,
    avatarURL: avatarURL || user.avatarURL
  }

  await buildUserReference({ db, userID })
    .update(data)
    .catch(error => {
      throw new Error(`ユーザーの編集に失敗しました${error}`)
    })

  await auth.currentUser!.updateProfile({
    displayName: displayName || user.displayName,
    photoURL: avatarURL || user.avatarURL
  })

  await createSession(auth.currentUser)

  return { ...user, ...data }
}
