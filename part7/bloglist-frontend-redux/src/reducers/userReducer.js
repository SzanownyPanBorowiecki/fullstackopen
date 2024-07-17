import { createSlice } from '@reduxjs/toolkit'
import loginService from '#services/login'
import blogService from '#services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser: (state, action) => action.payload,
    clearUser: (state, action) => null
  }
})

export const {
  setUser,
} = userSlice.actions

export const initializeUser = () => {
  return dispatch => {
    const userJSON = window.localStorage.getItem('loggedBloglistUser')
    const user = JSON.parse(userJSON)
    if (userJSON) {
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }
}

export const loginUser = (credentials) => {
  return async dispatch => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem(
      'loggedBloglistUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)
    dispatch(userSlice.actions.setUser(user))
    return user
  }
}

export const logoutUser = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedBloglistUser')
    dispatch(userSlice.actions.clearUser())
  }
}

export default userSlice.reducer
