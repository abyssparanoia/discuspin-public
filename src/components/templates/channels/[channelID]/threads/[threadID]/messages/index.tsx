import React from 'react'
import { ChannelList } from 'src/components/organisms/ChannelList'
import { CreateChannelInput } from 'src/modules/channel'
import { CreateThreadInput } from 'src/modules/thread'
import CircularProgress from '@material-ui/core/CircularProgress'
import { ThreadList } from 'src/components/organisms/ThreadList'
import { Channel, Thread, Message } from 'src/modules/entities'
import Grid from '@material-ui/core/Grid'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { MessageList } from 'src/components/organisms/MessageList'
import { MessageForm } from 'src/components/organisms/MessageForm'
import { CreateMessageInput } from 'src/modules/message'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
      flexGrow: 1,
      backgroundColor: theme.palette.background.default
    }
  })
)

type Props = {
  isLoading: boolean
  channelID: string
  threadID: string
  channelList: Channel[]
  threadList: Thread[]
  messageList: Message[]
  handleCreateChannel: (values: CreateChannelInput) => void
  handleCreateThread: (values: CreateThreadInput) => void
  handleCreateMessage: (values: CreateMessageInput) => void
}

export const MessagesTemplate = ({
  isLoading,
  channelID,
  threadID,
  channelList,
  threadList,
  messageList,
  handleCreateChannel,
  handleCreateThread,
  handleCreateMessage
}: Props) => {
  const classes = useStyles()

  return (
    <Grid container className={classes.root}>
      {isLoading && <CircularProgress />}
      <ChannelList channelID={channelID} channelList={channelList} handleCreateChannel={handleCreateChannel} />
      <ThreadList
        channelID={channelID}
        threadID={threadID}
        threadList={threadList}
        handleCreateThread={handleCreateThread}
      />
      <Grid>
        <MessageList threadID={threadID} messageList={messageList} />
        <MessageForm channelID={channelID} threadID={threadID} onSubmit={handleCreateMessage} />
      </Grid>
    </Grid>
  )
}
