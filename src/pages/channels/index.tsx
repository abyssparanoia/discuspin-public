import React, { useEffect, useCallback } from 'react'
import { ExNextPageContext } from 'next'
import { authorize } from 'src/modules/services'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxStore } from 'src/modules/reducer'
import { watchChannelList, CreateChannelInput, unWatchChannelList } from 'src/modules/channel'
import { createChannel } from 'src/modules/channel'
import { ChannelsTemplate } from 'src/components/templates/channels'

type Props = {}

const Channels = (_: Props) => {
  const { channelList, isLoading } = useSelector(({ channel }: ReduxStore) => ({
    channelList: channel.list,
    isLoading: channel.isLoading
  }))
  const dispatch = useDispatch()

  const handleCreateChannel = useCallback((values: CreateChannelInput) => dispatch(createChannel(values)), [dispatch])

  useEffect(() => {
    dispatch(watchChannelList())

    return () => {
      dispatch(unWatchChannelList())
    }
  }, [dispatch])

  return <ChannelsTemplate channelList={channelList} isLoading={isLoading} handleCreateChannel={handleCreateChannel} />
}

Channels.getInitialProps = async (ctx: ExNextPageContext): Promise<void> => {
  await authorize(ctx)
}

export default Channels
