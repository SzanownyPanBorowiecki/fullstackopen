import { configureStore } from '@reduxjs/toolkit'

import { baseApi } from '#services/baseApi'

import notificationReducer from '#reducers/notificationReducer'
import authReducer from '#reducers/authReducer'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    [baseApi.reducerPath]: baseApi.reducer
  },

  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    baseApi.middleware
  ]
})
