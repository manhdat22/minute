import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from '../utils/request'
import { setFlashMessage } from './commonSlice'

export type FetchPostRequest = {
  slug: string
}

export type CreatePostRequest = {
  subId: string | number
  name: string
  content: string
}

export type DeletePostRequest = {
  id: number | string
}

export interface PostState {
  data: {
    sub: any
    role: number | null
    isAuthor: boolean
    post: any
    totalPosts: number
    totalSubscribers: number
  }
  error: any
}

const initialState: PostState = {
  data: {
    sub: {},
    role: null,
    isAuthor: false,
    post: {},
    totalPosts: 0,
    totalSubscribers: 0,
  },
  error: {},
}

export const fetchSinglePost = createAsyncThunk(
  'post/fetchSinglePost',
  async (params: FetchPostRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'GET',
        'http://localhost:8080/api/v1/post/show',
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

export const createPost = createAsyncThunk(
  'post/createPost',
  async (params: CreatePostRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'POST',
        'http://localhost:8080/api/v1/post/create',
        params,
      )

      if (response?.status === 200) {
        thunkAPI.dispatch(
          setFlashMessage({
            message: `Your post has been created.`,
            messageType: 'success',
          }),
        )
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

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async (params: CreatePostRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'PUT',
        'http://localhost:8080/api/v1/post/update',
        params,
      )

      if (response?.status === 200) {
        thunkAPI.dispatch(
          setFlashMessage({
            message: `Your post has been updated.`,
            messageType: 'success',
          }),
        )
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

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (params: DeletePostRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'DELETE',
        'http://localhost:8080/api/v1/post/delete',
        params,
      )

      if (response?.status === 200) {
        thunkAPI.dispatch(
          setFlashMessage({
            message: `The post has been deleted.`,
            messageType: 'success',
          }),
        )
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

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSinglePost.fulfilled, (state, action) => {
      if (action.payload) state.data = action.payload
    })
    builder.addCase(fetchSinglePost.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(createPost.fulfilled, (state, action) => {})
    builder.addCase(createPost.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(updatePost.fulfilled, (state, action) => {})
    builder.addCase(updatePost.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(deletePost.fulfilled, (state, action) => {})
    builder.addCase(deletePost.rejected, (state, action) => {
      state.error = action.payload
    })
  },
})

export default postSlice.reducer
