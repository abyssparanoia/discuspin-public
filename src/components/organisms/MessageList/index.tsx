import React from 'react'
import { MessageItem } from './MessageItem'
import { Message } from 'src/modules/entities'
import { Grid, makeStyles, createStyles, Theme } from '@material-ui/core'

// useStyles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: `${theme.spacing(3)}px 4px`
    }
  })
)

interface Props {
  threadID: string
  messageList: Message[]
}

// eslint-disable-next-line react/display-name
export const MessageList = ({ messageList }: Props) => {
  const classes = useStyles()

  return (
    <Grid className={classes.root}>
      {messageList.map(message => (
        <MessageItem key={message.id} message={message}></MessageItem>
      ))}
    </Grid>
  )
}
