import { combineReducers } from '@reduxjs/toolkit'

import authSlice from './authSlice'
import commonSlice from './commonSlice'
import profileSlice from './profileSlice'
import voteSlice from './voteSlice'
import homeSlice from './homeSlice'
import subSlice from './subSlice'
import postSlice from './postSlice'
import searchSlice from './searchSlice'

const rootReducer = combineReducers({
  auth: authSlice,
  common: commonSlice,
  profile: profileSlice,
  vote: voteSlice,
  home: homeSlice,
  sub: subSlice,
  post: postSlice,
  search: searchSlice,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
