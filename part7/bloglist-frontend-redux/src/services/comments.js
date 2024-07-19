import { baseApi } from '#services/baseApi'

const commentsApi = baseApi.injectEndpoints({
  endpoints: builder => ({

    getCommentsByBlogId: builder.query({
      query: blogId => `/blogs/${blogId}/comments`,
      providesTags: (result, error, arg) =>
        [{ type: 'Comments', id: arg }]
    }),

    addCommentToBlogId: builder.mutation({
      query: ({ blogId, content }) => ({
        url: `/blogs/${blogId}/comments`,
        method: 'POST',
        body: { content }
      }),
      invalidatesTags: (result, error, arg) =>
        [{ type: 'Comments', id: arg.blogId }]
    })

  })
})

export const {
  useGetCommentsByBlogIdQuery,
  useAddCommentToBlogIdMutation,
} = commentsApi
