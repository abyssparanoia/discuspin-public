import React, { useEffect, useCallback } from 'react'
import { ExNextPageContext } from 'next'
import { authorize } from 'src/modules/services'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxStore } from 'src/modules/reducer'
import { watchChannelList, CreateChannelInput, unWatchChannelList, createChannel } from 'src/modules/channel'
import { watchThreadList, createThread, CreateThreadInput, unWatchThreadList } from 'src/modules/thread'
import { useRouter } from 'next/router'
import { ThreadsTemplate } from 'src/components/templates/channels/[channelID]/threads'

type Props = {}

const Threads = (_: Props) => {
  const { channelList, threadList, isLoading } = useSelector(({ channel, thread }: ReduxStore) => ({
    channelList: channel.list,
    threadList: thread.list,
    isLoading: channel.isLoading || thread.isLoading
  }))
  const dispatch = useDispatch()
  const router = useRouter()
  const channelID = router.query.channelID as string

  const handleCreateChannel = useCallback((values: CreateChannelInput) => dispatch(createChannel(values)), [dispatch])
  const handleCreateThread = useCallback((values: CreateThreadInput) => dispatch(createThread(values, channelID)), [
    channelID,
    dispatch
  ])

  useEffect(() => {
    dispatch(watchChannelList())
    dispatch(watchThreadList({ channelID }))

    return () => {
      dispatch(unWatchChannelList())
      dispatch(unWatchThreadList())
    }
  }, [channelID, dispatch])

  return (
    <ThreadsTemplate
      isLoading={isLoading}
      channelID={channelID}
      channelList={channelList}
      threadList={threadList}
      handleCreateChannel={handleCreateChannel}
      handleCreateThread={handleCreateThread}
    />
  )
}

Threads.getInitialProps = async (ctx: ExNextPageContext): Promise<void> => {
  await authorize(ctx)
}

export default Threads
