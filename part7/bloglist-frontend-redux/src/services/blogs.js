import { baseApi } from '#services/baseApi'

const blogsApi = baseApi.injectEndpoints({
  endpoints: builder => ({

    getAllBlogs: builder.query({
      query: () => '/blogs',
      providesTags: (result = [], error, arg) => [
        'Blogs',
        ...result.map(({ id }) => ({ type: 'Blogs', id }))
      ]
    }),

    getBlogById: builder.query({
      query: blogId => `/blogs/${blogId}`,
      providesTags: (result, error, arg) =>
        [{ type: 'Blogs', id: arg }]
    }),

    addBlog: builder.mutation({
      query: blog => ({
        url: '/blogs',
        method: 'POST',
        body: blog
      }),
      invalidatesTags: ['Blogs', 'Users']
    }),

    removeBlog: builder.mutation({
      query: blogId => ({
        url: `/blogs/${blogId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Blogs', 'Users']
    }),

    updateBlog: builder.mutation({
      query: blog => ({
        url: `/blogs/${blog.id}`,
        method: 'PUT',
        body: blog
      }),
      invalidatesTags: (result, error, arg) =>
        [{ type: 'Blogs', id: arg.id }]
    }),

    likeBlog: builder.mutation({
      query: blogId => ({
        url: `/blogs/${blogId}/likes`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) =>
        [{ type: 'Blogs', id: arg }]
    }),

  })
})

export const {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useAddBlogMutation,
  useRemoveBlogMutation,
  useUpdateBlogMutation,
  useLikeBlogMutation
} = blogsApi
