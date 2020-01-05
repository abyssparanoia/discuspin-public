import { appFactory } from './factory'
import * as functions from 'firebase-functions'

export { onCreateMessage } from './functions/algolia'

export const nextApp = functions.https.onRequest(async (req, res) => {
  const server = await appFactory()
  server(req as any, res as any)
})
