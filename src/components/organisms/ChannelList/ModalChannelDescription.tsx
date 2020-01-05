import React, { useState } from 'react'
import {
  Modal,
  makeStyles,
  Button,
  CircularProgress,
  TextField,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'
import { Channel } from 'src/modules/entities'
import { Formik, Form, Field } from 'formik'
import { EditChannelInput, editChannel, deleteChannel } from 'src/modules/channel'
import { useDispatch } from 'react-redux'

interface Props {
  open: boolean
  closeHandler: () => void
  channel: Channel
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  formFields: {
    marginTop: theme.spacing(2),
    width: '100%',
    textAlign: 'left'
  },
  formTextArea: {
    marginTop: theme.spacing(2),
    width: '100%',
    height: '200px',
    textAlign: 'left'
  },
  formLabel: {
    fontSize: '1em',
    textAlign: 'left'
  }
}))

export const ModalChannelDescription = ({ channel, open, closeHandler }: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true)
  }

  const handleClickDelete = () => {
    dispatch(deleteChannel(channel.id))
    setDeleteDialogOpen(false)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
  }

  let values: EditChannelInput = {
    title: channel.title,
    description: channel.description
  }

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={closeHandler}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <div className={classes.paper}>
          <Formik
            enableReinitialize={true}
            initialValues={values}
            validate={(values: EditChannelInput) => {
              const errors: Partial<EditChannelInput> = {}
              const requiredMsg: string = '必須項目です。'

              if (!values.title) {
                errors.title = requiredMsg
              }

              if (!values.description) {
                errors.description = requiredMsg
              }
              return errors
            }}
            onSubmit={(values: EditChannelInput, { setSubmitting }) => {
              dispatch(editChannel(channel.id, values))
              closeHandler()
              setSubmitting(false)
            }}
          >
            {({ submitForm, isSubmitting, handleChange, values }) => (
              <Form>
                <Field
                  name="title"
                  type="text"
                  label="title"
                  className={classes.formFields}
                  component={TextField}
                  value={values.title}
                  onChange={handleChange('title')}
                />
                <Field
                  name="description"
                  type="text"
                  label="Description"
                  className={classes.formTextArea}
                  component={TextField}
                  value={values.description}
                  onChange={handleChange('description')}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  className={classes.formFields}
                  onClick={submitForm}
                >
                  {!isSubmitting ? '編集' : <CircularProgress size={24} />}
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  className={classes.formFields}
                  onClick={handleOpenDeleteDialog}
                >
                  削除
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>

      <Dialog
        open={deleteDialogOpen}
        keepMounted
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        style={{ zIndex: 9999 }}
      >
        <DialogTitle id="alert-dialog-slide-title">このチャンネルを削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            削除したチャンネルはもとには戻せません
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
    </div>
  )
}
