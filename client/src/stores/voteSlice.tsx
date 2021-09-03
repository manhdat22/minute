import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from '../utils/request'
import { setFlashMessage } from './commonSlice'

export type VoteRequest = {
  parentId: number
  parentType: string
}

export interface VoteState {
  vote: any
  error: any
}

const initialState: VoteState = {
  vote: {},
  error: null,
}

export const vote = createAsyncThunk(
  'vote/vote',
  async (params: VoteRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'POST',
        'http://localhost:8080/api/v1/vote/create',
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

const voteSlice = createSlice({
  name: 'vote',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(vote.fulfilled, (state, action) => {
      state.vote = action.payload.vote
    })
    builder.addCase(vote.rejected, (state, action) => {
      state.error = action.payload
    })
  },
})

export default voteSlice.reducer
