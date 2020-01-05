import * as functions from 'firebase-functions'
import { db } from '../firebase/admin'
import { Message } from '../modules/entities'
import { AlgoliaMessage } from '../algolia/interface'
import algoliasearch from 'algoliasearch'
const ALGOLIA_ID = functions.config().algolia.app_id
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key
// const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key
const ALGOLIA_INDEX_NAME = 'messages'

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)

export const onCreateMessage = functions.firestore
  .document('threads/{threadID}/messages/{messageID}')
  .onCreate(async (dsnp, context) => {
    const message = dsnp.data() as Message

    const threadID = context.params.threadID as string

    const threadDsnp = await db
      .collection('threads')
      .doc(threadID)
      .get()

    const { channelID } = threadDsnp.data() as { channelID: string }

    const algoliaMessageObject: AlgoliaMessage = {
      objectID: context.params.messageID,
      userID: message.userID,
      channelID,
      threadID,
      body: message.body
    }

    const index = client.initIndex(ALGOLIA_INDEX_NAME)
    await index.saveObject(algoliaMessageObject)
  })
