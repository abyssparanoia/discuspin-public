import React, { useState } from 'react'
import { Message } from 'src/modules/entities'
import { MarkdownItemImage } from './MarkdownItemImage'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import { ModalMessageEdit } from './ModalMessageEdit'
import { useDispatch } from 'react-redux'
import { deleteMessage } from 'src/modules/message'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'

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
  > p img {
    max-width: 200px;
    object-fit: cover;
  }
`

export const MessageItem = ({ message }: Props) => {
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const dispatch = useDispatch()

  const handleClickEdit = () => {
    setOpen(true)
  }

  const hadleCloseModal = () => {
    setOpen(false)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
  }

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true)
  }

  const handleClickDelete = () => {
    dispatch(deleteMessage(message.threadID, message.id))
    setDeleteDialogOpen(false)
  }

  return (
    <div>
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
      <MarkdownStyles>
        <ReactMarkdown source={message.body} renderers={{ image: MarkdownItemImage }}>
          {message.body}
        </ReactMarkdown>
      </MarkdownStyles>
      {/* TODO: メニュー化 */}
      <div style={{ fontSize: '12px', display: 'flex' }}>
        <div style={{ marginRight: '12px' }} onClick={handleClickEdit}>
          編集
        </div>
        <div onClick={handleOpenDeleteDialog}>削除</div>
      </div>
    </div>
  )
}
