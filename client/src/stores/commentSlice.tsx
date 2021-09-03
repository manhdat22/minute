import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from '../utils/request'
import { setFlashMessage } from './commonSlice'

export type CreateCommentRequest = {
  content: string
  userId: string | number
  postId: string | number
  parentId: string | number
}

export type DeleteCommentRequest = {
  id: number | string
}

export interface CommentState {
  error: any
}

const initialState: CommentState = {
  error: {},
}

export const createComment = createAsyncThunk(
  'comment/createComment',
  async (params: CreateCommentRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'POST',
        'http://localhost:8080/api/v1/comment/create',
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

export const deleteComment = createAsyncThunk(
  'post/deleteComment',
  async (params: DeleteCommentRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'PUT',
        'http://localhost:8080/api/v1/comment/delete',
        params,
      )

      if (response?.status === 200) {
        thunkAPI.dispatch(
          setFlashMessage({
            message: `The comment has been deleted.`,
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
    builder.addCase(createComment.fulfilled, (state, action) => {})
    builder.addCase(createComment.rejected, (state, action) => {
      state.error = action.payload
    })

    builder.addCase(deleteComment.fulfilled, (state, action) => {})
    builder.addCase(deleteComment.rejected, (state, action) => {
      state.error = action.payload
    })
  },
})

export default postSlice.reducer
