import React, { useEffect, useCallback } from 'react'
import { ExNextPageContext } from 'next'
import { authorize } from 'src/modules/services'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxStore } from 'src/modules/reducer'
import { watchChannelList, CreateChannelInput, unWatchChannelList, createChannel } from 'src/modules/channel'
import { watchThreadList, createThread, CreateThreadInput, unWatchThreadList, fetchThread } from 'src/modules/thread'
import { useRouter } from 'next/router'
import { MessagesTemplate } from 'src/components/templates/channels/[channelID]/threads/[threadID]/messages'
import {
  createMessage,
  CreateMessageInput,
  watchMessageList,
  unWatchMessageList,
  unsetReply
} from 'src/modules/message'

type Props = {}

const Threads = (_: Props) => {
  const { channelList, threadList, thread, messageList, isLoading } = useSelector(
    ({ channel, thread, message }: ReduxStore) => ({
      channelList: channel.list,
      threadList: thread.list,
      thread: thread.currenThread,
      messageList: message.list,
      isLoading: channel.isLoading || thread.isLoading || message.isLoading
    })
  )
  const dispatch = useDispatch()
  const router = useRouter()
  const channelID = router.query.channelID as string
  const threadID = router.query.threadID as string

  const handleCreateChannel = useCallback((values: CreateChannelInput) => dispatch(createChannel(values)), [dispatch])
  const handleCreateThread = useCallback((values: CreateThreadInput) => dispatch(createThread(values, channelID)), [
    channelID,
    dispatch
  ])
  const handleCreateMessage = useCallback((values: CreateMessageInput) => dispatch(createMessage(values)), [dispatch])

  useEffect(() => {
    dispatch(watchChannelList())
    dispatch(watchThreadList({ channelID }))
    dispatch(watchMessageList({ threadID }))
    dispatch(fetchThread(threadID))
    dispatch(unsetReply())

    return () => {
      dispatch(unWatchChannelList())
      dispatch(unWatchThreadList())
      dispatch(unWatchMessageList())
    }
  }, [channelID, dispatch, threadID])

  return (
    <MessagesTemplate
      isLoading={isLoading}
      channelID={channelID}
      threadID={threadID}
      channelList={channelList}
      thread={thread}
      threadList={threadList}
      messageList={messageList}
      handleCreateChannel={handleCreateChannel}
      handleCreateThread={handleCreateThread}
      handleCreateMessage={handleCreateMessage}
    />
  )
}

Threads.getInitialProps = async (ctx: ExNextPageContext): Promise<void> => {
  await authorize(ctx)
}

export default Threads
