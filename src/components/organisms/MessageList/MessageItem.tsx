import React, { useState, MouseEvent } from 'react'
import { Message } from 'src/modules/entities'
import styled from 'styled-components'
import { ModalMessageEdit } from './ModalMessageEdit'
import { useDispatch, useSelector } from 'react-redux'
import { deleteMessage, setReply } from 'src/modules/message'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  makeStyles,
  Theme,
  createStyles,
  Menu,
  MenuItem
} from '@material-ui/core'

import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import ReplyIcon from '@material-ui/icons/Reply'
import { ReduxStore } from 'src/modules/reducer'
import { Markdown } from 'src/components/atoms/MarkdownParser'
import { MessageReply } from './MessageReply'

interface Props {
  message: Message
}

const MarkdownStyles = styled.div`
  > h1 {
    font-size: 40px;
  }
  > h2 {
    font-size: 26px;
  }
  > h3 {
    font-size: 20px;
  }

  > p {
    white-space: pre-wrap;
    word-break: break-all;
    margin: 12px 0px;
    line-height: 1.2;
  }
  > p img {
    max-width: 200px;
    object-fit: cover;
    cursor: pointer;
  }
  > p a {
    color: white;
  }
  > blockquote {
    padding: 0px;
    padding-left: 12px;
    margin: 0px;
    border-left: 3px solid #ffffff;
    word-break: break-all;
    white-space: pre-wrap;
  }
  ul {
    margin-left: -25px;
    margin-bottom: 8px;
  }
}
`

const thumbnailSize = '40px'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    userThumbnail: {
      display: 'block',
      borderRadius: '100%',
      width: thumbnailSize,
      height: thumbnailSize,
      objectFit: 'cover',
      boxShadow: theme.shadows[10],
      marginRight: theme.spacing(2),
      cursor: 'pointer',
      flex: '1 0 auto'
    },
    messageContainer: {
      position: 'relative',
      width: '100%',
      transition: '256ms',
      padding: theme.spacing(2),
      cursor: 'pointer',
      borderBottom: '1px solid #424242',
      '&:hover': {
        boxShadow: theme.shadows[3],
        borderBottom: '1px solid transparent'
      }
    },
    messageMain: {
      display: 'flex'
    },
    messageInformationWrapper: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    messageMenu: {
      width: '300px',
      maxWidth: '360px'
    },
    messageMenuItem: {
      padding: theme.spacing(2)
    }
  })
)

export const MessageItem = ({ message }: Props) => {
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const dispatch = useDispatch()
  const classes = useStyles()
  const { user } = message

  const { me } = useSelector(({ user }: ReduxStore) => ({
    me: user.me
  }))

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
    dispatch(deleteMessage(message.threadID, message.id))
    setDeleteDialogOpen(false)
  }

  const handleClickMenu = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleClickReply = () => {
    dispatch(setReply(message))
  }

  return (
    <Grid container>
      <ModalMessageEdit open={open} onClose={hadleCloseModal} message={message}></ModalMessageEdit>
      <Dialog
        open={deleteDialogOpen}
        keepMounted
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">このメッセージを削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            削除したメッセージはもとには戻せません
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

      <Grid className={classes.messageContainer}>
        {/* 返信部分 */}
        {message.reply ? (
          <Grid style={{ paddingLeft: '8px', margin: '12px 0px' }}>
            <MessageReply reply={message.reply} />
          </Grid>
        ) : null}
        {/* メイン */}
        <Grid className={classes.messageMain}>
          <img className={classes.userThumbnail} src={user.avatarURL} title={`${user.position} ${user.displayName}`} />
          <Grid style={{ width: '100%' }}>
            <Grid className={classes.messageInformationWrapper}>
              <div title={`${user.position} ${user.displayName}`}>{user.displayName}</div>
            </Grid>

            <MarkdownStyles>
              <Markdown source={message.body} />
            </MarkdownStyles>
          </Grid>
        </Grid>
        {me && me.id === message.user.id ? (
          <Grid style={{ position: 'absolute', top: '16px', right: '16px' }}>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickMenu}>
              <MoreHorizIcon fontSize="small" />
            </Button>
            <Menu
              className={classes.messageMenu}
              anchorEl={anchorEl}
              id="simple-menu"
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem className={classes.messageMenuItem} onClick={handleClickEdit}>
                編集
              </MenuItem>
              <MenuItem className={classes.messageMenuItem} onClick={handleOpenDeleteDialog}>
                削除
              </MenuItem>
            </Menu>
          </Grid>
        ) : null}
        {me && me.id !== message.user.id ? (
          <Grid style={{ position: 'absolute', top: '16px', right: '16px' }}>
            <Button onClick={handleClickReply}>
              <ReplyIcon fontSize="small" />
            </Button>
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  )
}
