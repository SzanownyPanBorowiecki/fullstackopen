import { baseApi } from '#services/baseApi'

const usersApi = baseApi.injectEndpoints({
  endpoints: builder => ({

    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: (result = [], error, arg) => [
        'Users',
        ...result.map(({ id }) => ({ type: 'User', id }))
      ]
    }),

    getUserById: builder.query({
      query: userId => `/users/${userId}`,
      providesTags: (result, error, arg) =>
        [{ type: 'Users', id: arg }]
    }),

    getBlogsByUserId: builder.query({
      query: userId => `/users/${userId}/blogs`,
      providesTags: (result, error, arg) => [
        'Blogs',
        result.map(({ id }) => ({ type: 'Blogs', id }))
      ]
    }),

    addUser: builder.mutation({
      query: user => ({
        url: '/users',
        method: 'POST',
        body: user
      }),
      invalidatesTag: ['Users']
    }),
  })
})

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetBlogsByUserIdQuery,
  useAddUserMutation
} = usersApi
