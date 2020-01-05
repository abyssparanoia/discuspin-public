import { storage } from 'src/firebase/client'
import moment from 'moment'

export const uploadImage = async (file: File) => {
  const imageRef = storage.ref('images').child(moment().format('X'))
  await imageRef.put(file)
  const url = (await imageRef.getDownloadURL()) as string
  return url
}
