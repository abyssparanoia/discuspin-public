import React from 'react'
import { Modal, makeStyles, Button, CircularProgress, TextField } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { EditChannelInput } from 'src/modules/channel'
import { useDispatch } from 'react-redux'
import { Thread } from 'src/modules/entities'
import { editThread, EditThreadInput } from 'src/modules/thread'

interface Props {
  open: boolean
  closeHandler: () => void
  thread: Thread
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
    width: '100%',
    textAlign: 'left',
    marginBottom: `${theme.spacing(2)}px !important`
  },
  formTextArea: {
    marginTop: theme.spacing(2),
    width: '100%',
    height: '200px',
    textAlign: 'left',
    marginBottom: `${theme.spacing(2)}px !important`
  },
  formLabel: {
    fontSize: '1em',
    textAlign: 'left'
  }
}))

export const ModalThreadEdit = ({ thread, open, closeHandler }: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  let values: EditThreadInput = {
    title: thread.title,
    description: thread.description
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
            onSubmit={(values: EditThreadInput, { setSubmitting }) => {
              dispatch(editThread({ ...values, threadID: thread.id }))
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
                  multiline={true}
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
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  )
}
