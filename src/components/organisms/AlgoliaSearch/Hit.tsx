import React from 'react'
import { Highlight } from 'react-instantsearch-dom'
import { AlgoliaMessage } from 'src/algolia/interface'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { useRouter } from 'next/router'

type Hit = AlgoliaMessage

export const Hit = ({ hit }: { hit: Hit }) => {
  const router = useRouter()
  const handleClick = () => {
    router.push(
      `/channels/[channelID]/threads/[threadID]/messages`,
      `/channels/${hit.channelID}/threads/${hit.threadID}/messages?jumpto=${hit.objectID}`
    )
  }

  return (
    <Card>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Typography variant="body2" color="textSecondary" className="hit-body">
            <Highlight attribute="body" hit={hit} />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" className="hit-userID">
            {hit.userID}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
