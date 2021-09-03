import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { removeToken, setToken } from '../utils/credential'
import { request } from '../utils/request'
import { setFlashMessage } from './commonSlice'

export interface AuthState {
  user: any | null
  error: any
}

export type LoginRequest = {
  id: string
  password: string
}

export type RegisterRequest = {
  email: string
  username: string
  password: string
}

const initialState: AuthState = {
  user: null,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ id, password }: LoginRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'POST',
        'http://localhost:8080/api/v1/login',
        { id, password },
      )

      if (response?.status === 200) {
        setToken(response.user.token)
        thunkAPI.dispatch(
          setFlashMessage({
            message: `Welcome u/${response.user.username}!`,
            messageType: 'success',
          }),
        )
        return response
      } else {
        thunkAPI.dispatch(
          setFlashMessage({ message: response.message, messageType: 'error' }),
        )

        return response
      }
    } catch (e: any) {
      console.log(e)
    }
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async (params: RegisterRequest, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'POST',
        'http://localhost:8080/api/v1/register',
        params,
      )

      if (response?.status === 200) {
        setToken(response.user.token)
        thunkAPI.dispatch(
          setFlashMessage({
            message: `Welcome u/${response.user.username}!`,
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

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, thunkAPI): Promise<any> => {
    try {
      const response = await request(
        'POST',
        'http://localhost:8080/api/v1/getCurrentUser',
        {},
      )

      if (response?.status === 200) {
        return response
      } else {
        return thunkAPI.rejectWithValue(response)
      }
    } catch (e: any) {
      console.log(e)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = initialState.user
      removeToken()
    },
    clearError: (state) => {
      state.error = initialState.error
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.fulfilled, (state, action) => {
      if (action.payload) state.user = action.payload.user
    })
    builder.addCase(register.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload) state.user = action.payload.user
    })
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload
    })
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload?.user
    })
  },
})

export const { logout } = authSlice.actions

export default authSlice.reducer
