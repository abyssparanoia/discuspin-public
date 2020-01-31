import React from 'react'
import { Message } from 'src/modules/entities'
import { makeStyles, Theme, createStyles, Grid, Button } from '@material-ui/core'
import { Markdown } from 'src/components/atoms/MarkdownParser'
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'

interface Props {
  reply: Message
  hasRemove?: boolean
  onClickClose?: () => void
}

const ReplyMarkdownStyle = styled.div`
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
  ul {
    margin-left: -25px;
    margin-bottom: 8px;
  }
  > blockquote {
    padding: 0px;
    padding-left: 12px;
    margin: 0px;
    border-left: 3px solid #ffffff;
    word-break: break-all;
    white-space: pre-wrap;
  }
`

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    root: {
      position: 'relative',
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

export const MessageReply = ({ reply, onClickClose }: Props) => {
  const classes = useStyles()
  return (
    <Grid className={classes.root}>
      <Grid className={classes.replyUser}>
        <img className={classes.replyUserImage} src={reply.user.avatarURL} />
        {reply.user.displayName}
      </Grid>
      <ReplyMarkdownStyle>
        <Markdown source={reply.body} />
      </ReplyMarkdownStyle>
      {onClickClose ? (
        <Button onClick={onClickClose} style={{ position: 'absolute', top: '0px', right: '0px' }}>
          <CloseIcon fontSize="small" />
        </Button>
      ) : null}
    </Grid>
  )
}
