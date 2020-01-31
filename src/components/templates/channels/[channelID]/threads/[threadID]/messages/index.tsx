import React, { useEffect, useState } from 'react'
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
import { ThreadInformation } from 'src/components/organisms/ThreadList/ThreadInformation'
import { CreateMessageInput } from 'src/modules/message'
import SplitPane from 'react-split-pane'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      overflow: 'hidden'
    },
    messageContainer: {
      display: 'flex',
      flexDirection: 'column',
      flex: ' 1 1 auto',
      overflow: 'hidden',
      height: '100%'
    },

    messageList: {
      width: '100%',
      height: '100%',
      overflow: 'scroll'
    },

    messageForm: {
      flex: '1 1 auto'
    },

    circleProgress: {
      position: 'absolute'
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
  thread?: Thread
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
  handleCreateMessage,
  thread
}: Props) => {
  const classes = useStyles()

  // スクロール値保存用
  const [scrollHeight, setScrollHeight] = useState(0)

  const ref = React.createRef<HTMLDivElement>()

  // マウント時はスクロールを一番下に
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [ref])

  useEffect(() => {
    if (ref.current) {
      // 以前の高さより高くなった場合
      if (ref.current.scrollHeight > scrollHeight) {
        // 一番下にいる時だけスクロール
        const isBottom = ref.current.scrollTop === scrollHeight - ref.current.offsetHeight
        if (isBottom) {
          ref.current.scrollTop = ref.current.scrollHeight
        }
        setScrollHeight(ref.current.scrollHeight)
      }
    }
  }, [messageList, ref, scrollHeight])

  return (
    <Grid container className={classes.root}>
      {isLoading && <CircularProgress className={classes.circleProgress} />}
      <SplitPane>
        <SplitPane allowResize={true}>
          <ChannelList channelID={channelID} channelList={channelList} handleCreateChannel={handleCreateChannel} />

          <ThreadList
            channelID={channelID}
            threadID={threadID}
            threadList={threadList}
            handleCreateThread={handleCreateThread}
          />
        </SplitPane>
        <Grid className={classes.messageContainer}>
          {thread ? <ThreadInformation thread={thread}></ThreadInformation> : null}
          <Grid className={classes.messageList} ref={ref}>
            <MessageList threadID={threadID} messageList={messageList} />
          </Grid>

          <Grid className={classes.messageForm}>
            <MessageForm channelID={channelID} threadID={threadID} onSubmit={handleCreateMessage} />
          </Grid>
        </Grid>
      </SplitPane>
    </Grid>
  )
}
