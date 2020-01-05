import React, { useEffect } from 'react'
import { Modal, Grid, makeStyles, TextField, Button, CircularProgress } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { EditUser, updateMe } from 'src/modules/user'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxStore } from 'src/modules/reducer'

interface Props {
  open: boolean
  closeHandler: () => void
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  form: {
    width: '300px',
    padding: theme.spacing(2),
    backgroundColor: 'white'
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
export const ModalUserEdit = ({ open, closeHandler }: Props) => {
  const classes = useStyles()
  const { me } = useSelector(({ user }: ReduxStore) => ({
    me: user.me
  }))
  const dispatch = useDispatch()

  let values: EditUser = {
    displayName: me?.displayName,
    position: me?.position,
    description: me?.description,
    avatarURL: me?.avatarURL
  }
  useEffect(() => {
    return () => {}
  }, [])

  return (
    <Modal open={open} onClose={closeHandler} className={classes.root}>
      <Grid className={classes.form}>
        <Formik
          enableReinitialize={true}
          initialValues={values}
          validate={(values: EditUser) => {
            const errors: Partial<EditUser> = {}
            const requiredMsg: string = '必須項目です。'

            if (!values.displayName) {
              errors.displayName = requiredMsg
            }

            if (!values.description) {
              errors.description = requiredMsg
            }

            return errors
          }}
          onSubmit={(values: EditUser, { setSubmitting }) => {
            setSubmitting(false)
            dispatch(updateMe(values))
            closeHandler()
          }}
        >
          {({ submitForm, isSubmitting, values, handleChange }) => (
            <Form>
              <Field
                name="displayName"
                type="text"
                label="表示名"
                className={classes.formFields}
                value={values.displayName}
                component={TextField}
                onChange={handleChange('displayName')}
              />
              <Field
                name="position"
                type="text"
                label="ポジション"
                className={classes.formFields}
                value={values.position}
                component={TextField}
                onChange={handleChange('position')}
              />
              <Field
                name="description"
                type="text"
                label="詳細"
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
            </Form>
          )}
        </Formik>
      </Grid>
    </Modal>
  )
}
