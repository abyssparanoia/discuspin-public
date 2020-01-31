import React, { useState, MouseEvent } from 'react'
import { Thread } from 'src/modules/entities'
import {
  Grid,
  Typography,
  makeStyles,
  createStyles,
  Theme,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core'

import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { useDispatch } from 'react-redux'
import { deleteThread } from 'src/modules/thread'
import { ModalThreadEdit } from './ModalThreadEdit'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: theme.spacing(3),
      boxShadow: theme.shadows[4],
      display: 'flex',
      justifyContent: 'space-between'
    }
  })
)

interface Props {
  thread: Thread
}

export const ThreadInformation = ({ thread }: Props) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const dispatch = useDispatch()

  const handleClickEdit = () => {
    setOpen(true)
    handleCloseMenu()
  }

  const hadleCloseModal = () => {
    setOpen(false)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
  }

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true)
    handleCloseMenu()
  }

  const handleClickDelete = () => {
    setDeleteDialogOpen(false)
    dispatch(deleteThread(thread.id))
  }

  const handleClickMenu = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  return (
    <Grid container>
      <ModalThreadEdit thread={thread} open={open} closeHandler={hadleCloseModal}></ModalThreadEdit>
      <Dialog
        open={deleteDialogOpen}
        keepMounted
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">このスレッドを削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            削除したスレッドはもとには戻せません
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleClickDelete} color="primary">
            削除
          </Button>
        </DialogActions>
      </Dialog>

      <Grid className={classes.root}>
        <Typography variant="h6">{thread.title}</Typography>
        <Grid>
          <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickMenu}>
            <MoreHorizIcon />
          </Button>
          <Menu anchorEl={anchorEl} id="simple-menu" keepMounted open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            <MenuItem onClick={handleClickEdit}>編集</MenuItem>
            <MenuItem onClick={handleOpenDeleteDialog}>削除</MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </Grid>
  )
}
