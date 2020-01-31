import React from 'react'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import { useRouter } from 'next/router'
import { Markdown } from 'src/components/atoms/MarkdownParser'
import { Hit as HitWithUser } from 'src/modules/algolia'
import styled from 'styled-components'
import { Grid, makeStyles, createStyles, Theme } from '@material-ui/core'

const StyledMarkdown = styled.div`
  padding: 0px 16px;
  > h1 {
    font-size: 40px;
  }
  > h2 {
    font-size: 26px;
  }
  > h3 {
    font-size: 20px;
  }

  > p {
    font-size: 14px;
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
  > blockquote {
    padding: 0px;
    padding-left: 12px;
    margin: 0px;
    border-left: 3px solid #ffffff;
    word-break: break-all;
    white-space: pre-wrap;
  }
  ul {
    margin-left: -25px;
    margin-bottom: 8px;
  }
`

const thumbnailSize = '32px'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '12px'
    },
    content: {
      width: '100%'
    },
    user: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderBottom: '1px solid #545454',
      padding: '8px 0px',
      marginBottom: '2px'
    },
    userThumbnail: {
      display: 'block',
      borderRadius: '100%',
      width: thumbnailSize,
      height: thumbnailSize,
      objectFit: 'cover',
      boxShadow: theme.shadows[10],
      marginRight: theme.spacing(2),
      cursor: 'pointer',
      flex: '0 1 auto'
    }
  })
)

export const Hit = ({ hit }: { hit: HitWithUser }) => {
  const classes = useStyles()
  const router = useRouter()
  const handleClick = () => {
    router.push(
      `/channels/[channelID]/threads/[threadID]/messages`,
      `/channels/${hit.channelID}/threads/${hit.threadID}/messages?jumpto=${hit.objectID}`
    )
  }
  return (
    <Card className={classes.root}>
      <CardActionArea onClick={handleClick}>
        <CardContent className={classes.content}>
          {hit.user ? (
            <Grid className={classes.user}>
              <img className={classes.userThumbnail} src={hit.user.avatarURL} />
              <Grid>{hit.user.displayName}</Grid>
            </Grid>
          ) : null}
          <StyledMarkdown>
            <Markdown source={hit.body}></Markdown>
          </StyledMarkdown>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
