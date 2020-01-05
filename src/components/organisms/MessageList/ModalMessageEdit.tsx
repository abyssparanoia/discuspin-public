import React, { useEffect } from 'react'
import { Modal, makeStyles, Grid, Button, TextField } from '@material-ui/core'
import { Formik, Form, FormikHelpers, Field } from 'formik'
import { CreateMessageInput, editMessage } from 'src/modules/message'
import { uploadImage } from 'src/modules/message'
import { useDispatch, useSelector } from 'react-redux'
import { Message } from 'src/modules/entities'
import { ReduxStore } from 'src/modules/reducer'

const useStyles = makeStyles(theme => ({
  editForm: {
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

interface Props {
  open: boolean
  onClose: () => void
  message: Message
}

export const ModalMessageEdit = (props: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { imageUrl } = useSelector(({ message }: ReduxStore) => ({
    imageUrl: message.imageUrl
  }))

  // 編集の送信
  const handleSubmit = (values: CreateMessageInput, helpers: FormikHelpers<{ text: string }>) => {
    dispatch(editMessage(props.message.threadID, props.message.id, values.text))
    helpers.setSubmitting(false)
    props.onClose()
  }
  // 画像のアップロード
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const file = e.currentTarget.files[0]
      dispatch(uploadImage(file))
    }
  }

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.open}
      onClose={props.onClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div className={classes.editForm}>
        <Formik
          enableReinitialize={true}
          initialValues={{ text: props.message.body }}
          validate={(values: CreateMessageInput) => {
            const errors: Partial<CreateMessageInput> = {}
            const requiredMsg: string = '必須項目です'
            if (!values.text) {
              errors.text = requiredMsg
            }
            return errors
          }}
          onSubmit={handleSubmit}
        >
          {({ submitForm, isSubmitting, setFieldValue, values, handleChange }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              if (imageUrl) {
                const data = `![image](${imageUrl})`
                setFieldValue('text', `${values.text} ${data}`)
              }
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [imageUrl])
            return (
              <Form
                //- short cut
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) && e.keyCode == 13) {
                    submitForm()
                  }
                }}
              >
                <Field
                  name="text"
                  type="text"
                  placeholder="投稿する内容を入力してください"
                  fullWidth={true}
                  component={TextField}
                  value={values.text}
                  onChange={handleChange('text')}
                ></Field>
                <Grid>
                  <Button color="primary" disabled={isSubmitting} onClick={submitForm}>
                    送信
                  </Button>
                  <label>
                    <Button variant="contained" component="label" style={{ pointerEvents: 'none' }} color="primary">
                      画像アップロード
                      <input type="file" id="input-file" style={{ display: 'none' }} onChange={handleImageUpload} />
                    </Button>
                  </label>
                </Grid>
              </Form>
            )
          }}
        </Formik>
      </div>
    </Modal>
  )
}
