import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
  messageType: 'success',
  isLoginVisible: false,
  isRegisterVisible: false,
  replyTo: {},
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setFlashMessage(state, action) {
      state.messageType = action.payload.messageType
      state.message = action.payload.message
    },
    resetFlashMessage(state, action) {
      state.messageType = initialState.messageType
      state.message = initialState.message
    },
    showLogin(state) {
      state.isLoginVisible = true
    },
    hideLogin(state) {
      state.isLoginVisible = false
    },
    showRegister(state) {
      state.isRegisterVisible = true
    },
    hideRegister(state) {
      state.isRegisterVisible = false
    },
    setReplyTo(state, action) {
      state.replyTo = action.payload
    },
  },
})

export const {
  setFlashMessage,
  resetFlashMessage,
  showLogin,
  hideLogin,
  showRegister,
  hideRegister,
  setReplyTo,
} = commonSlice.actions

export default commonSlice.reducer
