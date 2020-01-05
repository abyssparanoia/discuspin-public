import React from 'react'
import { ChannelList } from 'src/components/organisms/ChannelList'
import { Channel, Thread } from 'src/modules/entities'
import { CreateChannelInput } from 'src/modules/channel'
import { CreateThreadInput } from 'src/modules/thread'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ThreadList } from 'src/components/organisms/ThreadList'

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
  channelID: string
  isLoading: boolean
  channelList: Channel[]
  threadList: Thread[]
  handleCreateChannel: (values: CreateChannelInput) => void
  handleCreateThread: (values: CreateThreadInput) => void
}

export const ThreadsTemplate = ({
  channelID,
  isLoading,
  channelList,
  threadList,
  handleCreateChannel,
  handleCreateThread
}: Props) => {
  const classes = useStyles()

  return (
    <Grid container className={classes.root}>
      {isLoading && <CircularProgress />}
      <ChannelList channelID={channelID} channelList={channelList} handleCreateChannel={handleCreateChannel} />
      <ThreadList channelID={channelID} threadList={threadList} handleCreateThread={handleCreateThread} />
    </Grid>
  )
}
