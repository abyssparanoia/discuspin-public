import React, { useState } from 'react'
import { Tooltip, Fab, Button } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Link from 'next/link'
import { Thread } from 'src/modules/entities'
import { CreateThreadInput } from 'src/modules/thread'
import { CreateThreadForm } from 'src/components/organisms/ThreadList/CreateThreadForm'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxSizing: 'border-box',
      height: '100%',
      paddingTop: theme.spacing(1),
      backgroundColor: theme.palette.background.default,
      borderRight: 'solid 1px #424242',
      overflow: 'scroll'
    },
    title: {
      width: '100%',
      fontWeight: 'bold',
      fontSize: '18px',
      padding: theme.spacing(2),
      color: theme.palette.text.primary
    },
    addBtn: {
      marginRight: `${theme.spacing(2)}px !important`,
      flex: '1 0 auto'
    },
    dialogContentText: {
      fontSize: '13px'
    },
    dialogFiled: {
      paddingTop: '12px',
      paddingBottom: '12px',
      fontSize: '12px'
    },
    thread: {
      fontSize: '13px',
      cursor: 'pointer',
      transition: '128ms',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      '&:hover': {
        background: '#424242'
      }
    },
    threadActive: {
      fontSize: '13px',
      cursor: 'pointer',
      transition: '128ms',
      backgroundColor: theme.palette.primary.dark,
      boxShadow: theme.shadows[4],
      color: theme.palette.text.primary
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
    }
  })
)

interface Props {
  channelID: string
  threadID?: string
  threadList: Thread[]
  handleCreateThread: (values: CreateThreadInput) => void
}

export const ThreadList = ({ channelID, threadID, threadList, handleCreateThread }: Props) => {
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
        <div className={classes.title}>スレッド一覧</div>
        <Tooltip title="Add" aria-label="Add">
          <Fab color="primary" className={classes.addBtn} size="small" onClick={() => setIsDialog(true)}>
            <AddIcon fontSize="small" />
          </Fab>
        </Tooltip>
      </div>

      {threadList.map(thread => {
        return (
          <div key={thread.id} className={thread.id === threadID ? classes.threadActive : classes.thread}>
            <Link
              href={`/channels/[channelID]/threads/[threadID]/messages`}
              as={`/channels/${channelID}/threads/${thread.id}/messages`}
            >
              <a className={classes.link}>{thread.title}</a>
            </Link>
          </div>
        )
      })}
      <Dialog open={isDialog} aria-labelledby="form-dialog-title">
        <DialogContent>
          <CreateThreadForm onSubmit={handleCreateThread} onClose={() => setIsDialog(false)} />
        </DialogContent>
        <Button onClick={() => setIsDialog(false)} color="primary">
          キャンセル
        </Button>
      </Dialog>
    </div>
  )
}
