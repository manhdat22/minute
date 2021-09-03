import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from '../utils/request'
import { setFlashMessage } from './commonSlice'

export type GetProfileRequest = {
  username: string
}

export type UpdateProfileRequest = {
  bio: string
}

export interface ProfileState {
  profile: any
  posts: Array<any>
  subs: Array<any>
  totalPosts: number
  error: any
}

const initialState: ProfileState = {
  profile: {},
  posts: [],
  subs: [],
  totalPosts: 0,
  error: null,
}

export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (params: GetProfileRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'GET',
        'http://localhost:8080/api/v1/profile',
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

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (params: UpdateProfileRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'PUT',
        'http://localhost:8080/api/v1/profile/update',
        params,
      )

      if (response?.status === 200) {
        thunkAPI.dispatch(
          setFlashMessage({
            message: `Your profile has been updated.`,
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

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProfile.fulfilled, (state, action) => {
      if (action.payload) {
        state.posts = action.payload.posts
        state.profile = action.payload.profile
        state.subs = action.payload.subs
        state.totalPosts = action.payload.totalPosts
      }
    })
    builder.addCase(getProfile.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      if (action.payload) state.profile = action.payload.profile
    })
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.error = action.payload
    })
  },
})

export default profileSlice.reducer
