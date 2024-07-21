import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: null,
  reducers: {
    setAuth: (state, action) => action.payload,
    clearAuth: (state, action) => null
  }
})

export const {
  setAuth,
} = authSlice.actions

export const initializeAuth = () => {
  return dispatch => {
    const authJSON = window.localStorage.getItem('loggedBloglistUser')
    if (authJSON) {
      const auth = JSON.parse(authJSON)
      dispatch(setAuth(auth))
    }
  }
}

export const storeAuth = (user) => {
  return async dispatch => {
    window.localStorage.setItem(
      'loggedBloglistUser', JSON.stringify(user)
    )
    dispatch(authSlice.actions.setAuth(user))
  }
}


export const removeAuth = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedBloglistUser')
    dispatch(authSlice.actions.clearAuth())
  }
}

export default authSlice.reducer
