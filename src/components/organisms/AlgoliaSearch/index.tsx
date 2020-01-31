import React from 'react'
import { InstantSearch } from 'react-instantsearch-dom'
import { searchClient } from 'src/algolia/search-client'
import { CustomSearchBox } from './CusotomSearchBox'
import { CustomHits } from './CustomHits'
import { Grid } from '@material-ui/core'

export const AlgoliaSearch = () => {
  return (
    <InstantSearch indexName="messages" searchClient={searchClient} stalledSearchDelay={128}>
      <Grid
        style={{
          padding: '16px 32px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'scroll'
        }}
      >
        <CustomSearchBox />
        <CustomHits />
      </Grid>
    </InstantSearch>
  )
}
