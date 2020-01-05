import algoliasearch from 'algoliasearch/lite'

export const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_SEARCH_KEY!)
