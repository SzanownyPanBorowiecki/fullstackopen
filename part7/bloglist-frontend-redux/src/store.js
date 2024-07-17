import { configureStore } from '@reduxjs/toolkit'
import blogsReducer from './reducers/blogsReducer'
import notificationReducer from './reducers/notificationReducer'
import userReducer from './reducers/userReducer'
import usersReducer from './reducers/usersReducer'

export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    blogs: blogsReducer,
    users: usersReducer,
  }
})
