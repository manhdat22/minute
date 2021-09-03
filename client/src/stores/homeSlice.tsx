import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from '../utils/request'
import { setFlashMessage } from './commonSlice'

export type HomeRequest = {}

export interface HomeState {
  data: {
    posts: any[]
    totalPosts: number
    subs: any[]
  }
  error: any
}

const initialState: HomeState = {
  data: {
    posts: [],
    totalPosts: 0,
    subs: [],
  },
  error: null,
}

export const fetchPost = createAsyncThunk(
  'home/fetchPost',
  async (params: HomeRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'GET',
        'http://localhost:8080/api/v1/post/',
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

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPost.fulfilled, (state, action) => {
      state.data = action.payload
    })
    builder.addCase(fetchPost.rejected, (state, action) => {
      state.error = action.payload
    })
  },
})

export default homeSlice.reducer
