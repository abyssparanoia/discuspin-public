const admin = require('firebase-admin')

const app = admin.initializeApp({
  credential: admin.credential.cert(require('../firebase.admin.key.json'))
})

const db = app.firestore()

const main = async () => {
  const messageCol = db
    .collection('threads')
    .doc('8101iq9vdY5arH9q6I7P')
    .collection('messages')

  const qsnp = await messageCol.get()

  const list = []
  qsnp.docs.map(dsnp => {
    const message = dsnp.data()
    list.push({
      objectID: dsnp.id,
      userID: message.userID,
      channelID: 'sMPTSOBxvFaM3BNlgogI',
      threadID: '8101iq9vdY5arH9q6I7P',
      body: message.body
    })
  })

  console.log(JSON.stringify(list))
}

main()
