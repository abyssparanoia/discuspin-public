import React, { useState } from 'react'
import { Button, Theme, makeStyles, createStyles, Grid } from '@material-ui/core'
import { Channel } from 'src/modules/entities'
import Link from 'next/link'
import { ModalChannelDescription } from './ModalChannelDescription'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    channel: {
      fontSize: '13px',
      padding: '24px 12px',
      cursor: 'pointer',
      transition: '128ms',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      '&:hover': {
        background: '#424242'
      }
    },
    channelActive: {
      fontSize: '13px',
      padding: '24px 12px',
      cursor: 'pointer',
      transition: '128ms',
      backgroundColor: theme.palette.primary.dark,
      boxShadow: theme.shadows[4],
      color: theme.palette.text.primary
    }
  })
)

interface Props {
  currentChannelId: string | undefined
  channel: Channel
}

export const ChannelItem = ({ channel, currentChannelId }: Props) => {
  const classes = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const handleClickDesciption = () => {
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
  }

  return (
    <Grid>
      <ModalChannelDescription open={open} closeHandler={handleCloseModal} channel={channel}></ModalChannelDescription>
      <Grid key={channel.id} className={channel.id === currentChannelId ? classes.channelActive : classes.channel}>
        <Link href={`/channels/[channelID]/threads`} as={`/channels/${channel.id}/threads`}>
          <a>{channel.title}</a>
        </Link>
        <Button onClick={handleClickDesciption}>詳細</Button>
      </Grid>
    </Grid>
  )
}
