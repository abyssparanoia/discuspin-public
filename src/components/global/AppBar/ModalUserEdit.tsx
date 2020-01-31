import React, { useEffect } from 'react'
import { Modal, Grid, makeStyles, TextField, Button, CircularProgress, Avatar } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { EditUser, updateMe, uploadImage } from 'src/modules/user'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxStore } from 'src/modules/reducer'
import CameraAltIcon from '@material-ui/icons/CameraAlt'

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
    width: '40vw',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper
  },
  formFields: {
    marginTop: theme.spacing(2),
    width: '100%',
    textAlign: 'left',
    marginBottom: `${theme.spacing(4)}px !important`
  },
  formTextArea: {
    marginTop: theme.spacing(2),
    width: '100%',
    height: '200px',
    textAlign: 'left',
    marginBottom: `${theme.spacing(4)}px !important`
  },
  formLabel: {
    fontSize: '1em',
    textAlign: 'left'
  },
  avatarWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    marginTop: '12px'
  },
  avatarSize: {
    width: '150px',
    height: '150px'
  }
}))
export const ModalUserEdit = ({ open, closeHandler }: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const { me, imageURL } = useSelector(({ user }: ReduxStore) => ({
    me: user.me,
    imageURL: user.imageURL
  }))

  let values: EditUser = {
    displayName: me?.displayName,
    position: me?.position,
    description: me?.description,
    avatarURL: me?.avatarURL
  }

  // upload image
  const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const file = e.currentTarget.files[0]
      dispatch(uploadImage(file))
    }
  }

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
          {({ submitForm, isSubmitting, values, handleChange }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              if (imageURL) {
                values.avatarURL = imageURL
              }
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [imageURL])
            return (
              <Form>
                <Grid className={classes.avatarWrapper} component="label">
                  <input style={{ display: 'none' }} type="file" onChange={handleChangeAvatar} />
                  <Avatar src={imageURL || values.avatarURL} className={classes.avatarSize} variant="circle"></Avatar>
                  <CameraAltIcon
                    fontSize="large"
                    style={{
                      pointerEvents: 'none',
                      position: 'absolute',
                      textShadow: '4px 4px 10px #000000'
                    }}
                  />
                </Grid>

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
            )
          }}
        </Formik>
      </Grid>
    </Modal>
  )
}
