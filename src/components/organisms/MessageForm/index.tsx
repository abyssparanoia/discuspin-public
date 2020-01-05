import React, { useEffect } from 'react'
import { Formik, Field, Form } from 'formik'
import { CreateMessageInput } from 'src/modules/message'
import { TextField } from 'formik-material-ui'
import Button from '@material-ui/core/Button'
import { Grid } from '@material-ui/core'
import { uploadImage } from 'src/modules/message'
import { ReduxStore } from 'src/modules/reducer'
import { useSelector, useDispatch } from 'react-redux'
interface Props {
  channelID: string
  threadID: string
  onSubmit: (values: CreateMessageInput) => void
}

export const MessageForm = ({ onSubmit }: Props) => {
  const { imageUrl } = useSelector(({ message }: ReduxStore) => ({
    imageUrl: message.imageUrl
  }))

  const dispatch = useDispatch()

  // upload image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const file = e.currentTarget.files[0]
      dispatch(uploadImage(file))
    }
  }

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={{ text: '' }}
        validate={(values: CreateMessageInput) => {
          const errors: Partial<CreateMessageInput> = {}
          const requiredMsg: string = '必須項目です'

          if (!values.text) {
            errors.text = requiredMsg
          }

          return errors
        }}
        onSubmit={(values: CreateMessageInput, { setSubmitting }) => {
          onSubmit(values)
          setSubmitting(false)
          values.text = ''
        }}
      >
        {({ submitForm, isSubmitting, setFieldValue, values }) => {
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
                multiline={true}
                component={TextField}
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
  )
}
