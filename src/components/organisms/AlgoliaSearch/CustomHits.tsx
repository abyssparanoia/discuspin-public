import React, { useEffect } from 'react'
import { connectHits } from 'react-instantsearch-dom'
import { HitsProvided } from 'react-instantsearch-core'

import { Hit as CustomHit } from './Hit'
import { updateHitLists } from 'src/modules/algolia'

import { AlgoliaMessage } from 'src/algolia/interface'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxStore } from 'src/modules/reducer'

const Hits = ({ hits }: HitsProvided<AlgoliaMessage>) => {
  const { hitLists } = useSelector(({ algolia }: ReduxStore) => ({
    hitLists: algolia.hitLists
  }))
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(updateHitLists(hits))
  }, [dispatch, hits])

  return (
    <ol style={{ padding: '8px', height: '100%' }}>
      {hitLists.map(item => {
        return <CustomHit key={item.objectID} hit={item} />
      })}
    </ol>
  )
}

export const CustomHits = connectHits(Hits)
