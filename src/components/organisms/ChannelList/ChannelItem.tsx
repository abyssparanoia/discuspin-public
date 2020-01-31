import React, { useState } from 'react'
import { Button, Theme, makeStyles, createStyles, Grid } from '@material-ui/core'
import { Channel } from 'src/modules/entities'
import Link from 'next/link'
import { ModalChannelDescription } from './ModalChannelDescription'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    channel: {
      fontSize: '13px',
      cursor: 'pointer',
      transition: '128ms',
      backgroundColor: theme.palette.background.default,
      '&:hover': {
        background: '#424242'
      }
    },
    channelActive: {
      fontSize: '13px',
      cursor: 'pointer',
      transition: '128ms',
      backgroundColor: theme.palette.primary.dark,
      boxShadow: theme.shadows[4]
    },

    link: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      textDecoration: 'none',
      width: '100%',
      height: '100%',
      color: theme.palette.text.primary,
      padding: theme.spacing(3)
    },
    descriptionButton: {
      fontSize: '10px',
      padding: '2px 4px !important',
      height: '30px'
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
  const handleClickDesciption = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    e.preventDefault()
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
          <a className={classes.link}>
            <div>{channel.title}</div>
            <Button onClick={handleClickDesciption} className={classes.descriptionButton}>
              詳細
            </Button>
          </a>
        </Link>
      </Grid>
    </Grid>
  )
}
