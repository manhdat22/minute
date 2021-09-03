import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from '../utils/request'
import { setFlashMessage } from './commonSlice'

export type SubRequest = {
  slug: string
}

export type SubscribeRequest = {
  id: string | number
}

export type CreateRequest = {
  iconId: string | number
  name: string
  description: string
}

export type UpdateRequest = {
  iconId: string | number
  id: string | number
  description: string
}

export interface SubState {
  data: {
    sub: any
    role: number | null
    posts: any[]
    totalPosts: number
    totalSubscribers: number
  }
  subs: any[]
  error: any
}

const initialState: SubState = {
  data: {
    sub: {},
    role: null,
    posts: [],
    totalPosts: 0,
    totalSubscribers: 0,
  },
  subs: [],
  error: null,
}

export const fetchAllSub = createAsyncThunk(
  'sub/fetchAllSub',
  async (_params, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'GET',
        'http://localhost:8080/api/v1/sub/fetch-sub',
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

export const fetchSub = createAsyncThunk(
  'sub/fetchSub',
  async (params: SubRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'GET',
        'http://localhost:8080/api/v1/sub/',
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

export const createSub = createAsyncThunk(
  'sub/createSub',
  async (params: SubRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'POST',
        'http://localhost:8080/api/v1/sub/create',
        params,
      )

      if (response?.status === 200) {
        thunkAPI.dispatch(
          setFlashMessage({
            message: 'New community has been added.',
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

export const updateSub = createAsyncThunk(
  'sub/updateSub',
  async (params: UpdateRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'PUT',
        'http://localhost:8080/api/v1/sub/update',
        params,
      )

      if (response?.status === 200) {
        thunkAPI.dispatch(
          setFlashMessage({
            message: 'Your community has been updated.',
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

export const subscribe = createAsyncThunk(
  'sub/subscribe',
  async (params: SubscribeRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'POST',
        'http://localhost:8080/api/v1/sub/subscribe',
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

export const unsubscribe = createAsyncThunk(
  'sub/unsubscribe',
  async (params: SubscribeRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'POST',
        'http://localhost:8080/api/v1/sub/unsubscribe',
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

const subSlice = createSlice({
  name: 'sub',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = initialState.error
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSub.fulfilled, (state, action) => {
      state.data = action.payload
    })
    builder.addCase(fetchSub.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(fetchAllSub.fulfilled, (state, action) => {
      state.subs = action.payload.subs
    })
    builder.addCase(fetchAllSub.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(createSub.fulfilled, (state, action) => {})
    builder.addCase(createSub.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(updateSub.fulfilled, (state, action) => {})
    builder.addCase(updateSub.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(subscribe.fulfilled, (state, action) => {
      state.data = action.payload
    })
    builder.addCase(subscribe.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(unsubscribe.fulfilled, (state, action) => {
      state.data = action.payload
    })
    builder.addCase(unsubscribe.rejected, (state, action) => {
      state.error = action.payload
    })
  },
})

export const { clearError } = subSlice.actions

export default subSlice.reducer
