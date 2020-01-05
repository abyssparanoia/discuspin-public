import React, { useState } from 'react'
import { Tooltip, Fab, Button } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import { Channel } from 'src/modules/entities'
import { CreateChannelForm } from 'src/components/organisms/ChannelList/CreateChannelForm'
import { CreateChannelInput } from 'src/modules/channel'
import { ChannelItem } from './ChannelItem'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxSizing: 'border-box',
      width: '21vw',
      height: '100%',
      padding: '16px 0px',
      backgroundColor: theme.palette.background.default,
      borderRight: 'solid 1px #424242',
      overflow: 'scroll'
    },
    title: {
      width: '100%',
      fontWeight: 'bold',
      fontSize: '18px',
      padding: '0px 12px',
      color: '#1c54b2'
    },
    addBtn: {
      width: '30px',
      height: '30px',
      marginRight: '8px',
      flex: '1 0 auto',
      minHeight: '10px !important'
    },
    dialogContentText: {
      fontSize: '13px'
    },
    dialogFiled: {
      paddingTop: '12px',
      paddingBottom: '12px',
      fontSize: '12px'
    }
  })
)

interface Props {
  channelID?: string
  channelList: Channel[]
  handleCreateChannel: (values: CreateChannelInput) => void
}

export const ChannelList = ({ channelID, channelList, handleCreateChannel }: Props) => {
  const [isDialog, setIsDialog] = useState<boolean>(false)
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-betweeen',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >
        <div className={classes.title}>チャンネル一覧</div>
        <Tooltip title="Add" aria-label="Add">
          <Fab color="secondary" className={classes.addBtn} size="small" onClick={() => setIsDialog(true)}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </div>

      {channelList.map(channel => {
        return <ChannelItem key={channel.id} channel={channel} currentChannelId={channelID}></ChannelItem>
      })}
      <Dialog open={isDialog} aria-labelledby="form-dialog-title">
        <DialogContent>
          <CreateChannelForm onSubmit={handleCreateChannel} onClose={() => setIsDialog(false)} />
        </DialogContent>
        <Button onClick={() => setIsDialog(false)} color="primary">
          キャンセル
        </Button>
      </Dialog>
    </div>
  )
}
