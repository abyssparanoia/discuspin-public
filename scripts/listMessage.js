const admin = require('firebase-admin')

const app = admin.initializeApp({
  credential: admin.credential.cert(require('../firebase.admin.key.json'))
})

const db = app.firestore()

const main = async () => {
  const messageCol = db.collectionGroup('messages')

  const qsnp = await messageCol.get()

  const list = []
  const promises = qsnp.docs.map(async dsnp => {
    const message = dsnp.data()
    const paths = dsnp.ref.path.split('/')
    const threadID = paths[1]
    const threadDsnp = await db
      .collection('threads')
      .doc(threadID)
      .get()
    const { channelID } = threadDsnp.data()
    list.push({
      objectID: dsnp.id,
      userID: message.userID,
      channelID,
      threadID,
      body: message.body
    })
  })

  await Promise.all(promises)

  console.log(JSON.stringify(list))
}

main()
