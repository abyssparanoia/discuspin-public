import React from 'react'
import { ChannelList } from 'src/components/organisms/ChannelList'
import { CreateChannelInput } from 'src/modules/channel'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Channel } from 'src/modules/entities'

type Props = {
  isLoading: boolean
  channelList: Channel[]
  handleCreateChannel: (values: CreateChannelInput) => void
}

export const ChannelsTemplate = ({ channelList, handleCreateChannel, isLoading }: Props) => {
  return (
    <>
      {isLoading && <CircularProgress />}
      <ChannelList channelList={channelList} handleCreateChannel={handleCreateChannel} />
    </>
  )
}
