import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    notifyError: (state, action) => ({
      type: 'error',
      message: action.payload
    }),
    notifySuccess: (state, action) => ({
      type: 'success',
      message: action.payload
    }),
    clearNotification: (state) => null
  }
})

export const {
  notifyError,
  notifySuccess
} = notificationSlice.actions

export default notificationSlice.reducer
