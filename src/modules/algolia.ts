import actionCreatorFactory from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Dispatch } from 'redux'
import { User } from './entities'
import { AlgoliaMessage } from 'src/algolia/interface'
import { fetchUser } from './repositories'

const actionCreator = actionCreatorFactory('algolia')

export interface State {
  hitLists: Hit[]
  isLoading: boolean
  error?: Error
}

const initialState: State = {
  hitLists: [],
  isLoading: false
}

export interface Hit extends AlgoliaMessage {
  user?: User
}

export const actions = {
  updateHitLists: actionCreator.async<void, { hitLists: Hit[] }, Error>('UPDATE_HIT_LISTS')
}

// Algoliaの検索結果に user をぶら下げて redux state に格納する
export const updateHitLists = (hits: Hit[]) => async (dispatch: Dispatch) => {
  dispatch(actions.updateHitLists.started())
  try {
    // ユーザーを取得して mapping
    const promises = hits.map(item => {
      const userID = item.userID
      return fetchUser(userID).then(user => {
        item.user = user
        return item
      })
    })
    const hitLists = await Promise.all(promises)
    dispatch(actions.updateHitLists.done({ result: { hitLists } }))
  } catch (error) {
    dispatch(actions.updateHitLists.failed({ error }))
  }
}

export const reducer = reducerWithInitialState(initialState)
  .case(actions.updateHitLists.started, (state, _) => ({
    ...state,
    isLoading: true
  }))
  .case(actions.updateHitLists.done, (state, payload) => ({
    ...state,
    isLoading: false,
    hitLists: payload.result.hitLists
  }))
  .case(actions.updateHitLists.failed, (state, payload) => ({
    ...state,
    isLoading: false,
    error: payload.error
  }))
