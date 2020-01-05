import React from 'react'
import { MessageItem } from './MessageItem'
import { Message } from 'src/modules/entities'

// useStyles
// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       boxSizing: 'border-box'
//     }
//   })
// )

interface Props {
  threadID: string
  messageList: Message[]
}

export const MessageList = ({ messageList }: Props) => {
  return (
    <div>
      {messageList.map(message => (
        <MessageItem key={message.id} message={message}></MessageItem>
      ))}
    </div>
  )
}
