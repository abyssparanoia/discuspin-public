import { combineReducers } from 'redux'
import { State as ErrorState, reducer as errorReducer } from './error'
import { State as TableState, reducer as tableReducer } from './table'
import { State as AuthState, reducer as authReducer } from './auth'
import { State as ChannelState, reducer as channelReducer } from './channel'
import { State as ThreadState, reducer as threadReducer } from './thread'
import { State as MessageState, reducer as messageReducer } from './message'
import { State as UserState, reducer as userReducer } from './user'
import { State as AlgliaState, reducer as algoliaReducer } from './algolia'

export interface ReduxStore {
  error: ErrorState
  table: TableState
  auth: AuthState
  channel: ChannelState
  thread: ThreadState
  message: MessageState
  user: UserState
  algolia: AlgliaState
}

export const createRootReducer = () =>
  combineReducers({
    error: errorReducer,
    table: tableReducer,
    auth: authReducer,
    channel: channelReducer,
    thread: threadReducer,
    message: messageReducer,
    user: userReducer,
    algolia: algoliaReducer
  })
