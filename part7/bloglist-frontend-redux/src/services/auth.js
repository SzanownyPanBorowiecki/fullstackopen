import { baseApi } from '#services/baseApi'

const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({

    login: builder.mutation({
      query: credentials => ({
        url: '/login',
        method: 'POST',
        body: credentials
      })
    })

  })
})

export const {
  useLoginMutation
} = authApi
