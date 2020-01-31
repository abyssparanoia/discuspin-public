import React, { useState } from 'react'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core'

interface Props {
  alt: string
  src: string
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: '60vw',
    height: '60vw',
    maxHeight: '60vh',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: '16px'
    // padding: theme.spacing(2, 4, 3)
  }
}))

export const MarkdownItemImage = (props: Props) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const handleClickImage = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div className={classes.paper}>
          <img style={{ width: '100%', objectFit: 'contain', height: '100%' }} src={props.src}></img>
        </div>
      </Modal>
      <img src={props.src} onClick={handleClickImage} />
    </div>
  )
}
