import React from 'react'
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom'
import { searchClient } from 'src/algolia/search-client'
import { Hit } from './Hit'

export const AlgoliaSearch = () => {
  return (
    <InstantSearch indexName="messages" searchClient={searchClient}>
      <SearchBox />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  )
}
