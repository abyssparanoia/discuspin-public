import React, { useEffect } from 'react'
import { Formik, Field, Form } from 'formik'
import { CreateMessageInput, unsetReply } from 'src/modules/message'
import { TextField } from 'formik-material-ui'
import Button from '@material-ui/core/Button'
import { Grid, createStyles, makeStyles, Theme, Fab } from '@material-ui/core'
import { uploadImage } from 'src/modules/message'
import { ReduxStore } from 'src/modules/reducer'
import { useSelector, useDispatch } from 'react-redux'

import ImageIcon from '@material-ui/icons/Image'
import { MessageReply } from '../MessageList/MessageReply'

interface Props {
  channelID: string
  threadID: string
  onSubmit: (values: CreateMessageInput) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2)
    },
    form: {
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2),
      paddingTop: theme.spacing(4)
    },
    buttons: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing(2)
    },
    textArea: {
      '> textarea': {
        paddingTop: `${theme.spacing(4)}px !important`,
        paddingBottom: `${theme.spacing(4)}px !important`
      }
    },
    reply: {
      borderLeft: '3px solid #ffffff',
      paddingTop: '8px',
      paddingBottom: '4px',
      paddingLeft: '12px',
      marginBottom: '8px'
    },
    replyUser: {
      fontSize: '11px',
      margin: '0px 4px',
      display: 'flex',
      alignItems: 'center'
    },
    replyUserImage: {
      width: '24px',
      height: '24px',
      borderRadius: '100%',
      marginRight: '8px'
    }
  })
)

export const MessageForm = ({ onSubmit }: Props) => {
  const { imageUrl, reply } = useSelector(({ message: { imageUrl, reply } }: ReduxStore) => ({ imageUrl, reply }))

  const dispatch = useDispatch()

  const classes = useStyles()

  // upload image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const file = e.currentTarget.files[0]
      dispatch(uploadImage(file))
    }
  }

  const handleUnsetReply = () => {
    dispatch(unsetReply())
  }

  return (
    <div className={classes.root}>
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
              className={classes.form}
              //- short cut
              onKeyDown={(e: React.KeyboardEvent) => {
                if (((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) && e.keyCode == 13) {
                  submitForm()
                }
              }}
            >
              {/* 返信がある時 */}
              {reply ? <MessageReply reply={reply} onClickClose={handleUnsetReply} /> : null}
              <Field
                name="text"
                type="text"
                placeholder="投稿する内容を入力してください"
                fullWidth={true}
                multiline={true}
                component={TextField}
                className={classes.textArea}
              ></Field>
              <Grid className={classes.buttons}>
                <label htmlFor="input-file">
                  <Fab color="primary" component="label" size="small">
                    <ImageIcon />
                    <input type="file" id="input-file" style={{ display: 'none' }} onChange={handleImageUpload} />
                  </Fab>
                </label>
                <Button variant="contained" color="primary" disabled={isSubmitting} onClick={submitForm}>
                  送信
                </Button>
              </Grid>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
