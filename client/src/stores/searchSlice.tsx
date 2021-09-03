import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from '../utils/request'
import { setFlashMessage } from './commonSlice'

export type SearchRequest = {
  keyword: string
}

export interface SearchState {
  posts: any[]
  subs: any[]
  users: any[]
  error: any
}

const initialState: SearchState = {
  posts: [],
  subs: [],
  users: [],
  error: null,
}

export const search = createAsyncThunk(
  'search/fetchData',
  async (params: SearchRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'GET',
        'http://localhost:8080/api/v1/search/',
        params,
      )

      if (response?.status === 200) {
        return response
      } else {
        thunkAPI.dispatch(
          setFlashMessage({ message: response.message, messageType: 'error' }),
        )

        return thunkAPI.rejectWithValue(response)
      }
    } catch (e: any) {
      console.log(e)
    }
  },
)

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(search.fulfilled, (state, action) => {
      if (action.payload) {
        state.posts = action.payload.posts
        state.subs = action.payload.subs
        state.users = action.payload.users
      }
    })
    builder.addCase(search.rejected, (state, action) => {
      state.error = action.payload
    })
  },
})

export default searchSlice.reducer
