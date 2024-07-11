import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },

    clearNotification(state, action) {
      return ''
    }
  }
})

let notificationTimeout = null

//export const { setNotification, clearNotification } = notificationSlice.actions

export const setNotification = (content, timeout = 5) => {
  return async dispatch => {
    if (notificationTimeout) clearTimeout(notificationTimeout)
    dispatch(notificationSlice.actions.setNotification(content))

    notificationTimeout = setTimeout(
      () => dispatch(notificationSlice.actions.clearNotification()),
      timeout * 1000
    )
  }
}

export const clearNotification = () => {
  return async dispatch => {
    clearTimeout(notificationTimeout)
    notificationTimeout = null
    dispatch(notificationSlice.actions.clearNotification())
  }
}

export default notificationSlice.reducer
