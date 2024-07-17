import { createSlice } from '@reduxjs/toolkit'

import blogService from '#services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs: (state, action) => action.payload,
    addBlog: (state, action) => [...state, action.payload],
    removeBlog: (state, action) =>
      state.filter(e => e.id !== action.payload.id),

    updateBlog: (state, action) =>
      state.map(e =>
        e.id !== action.payload.id
          ? e
          : action.payload
        )
  }
})

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(blogsSlice.actions.setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch(blogsSlice.actions.addBlog(newBlog))
  }
}

export const createComment = (blog, comment) => {
  return async dispatch => {
    const updatedBlog = await blogService.createComment(blog.id, comment)
    dispatch(blogsSlice.actions.updateBlog(updatedBlog))
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    const updatedBlog = await blogService.update({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    })
    dispatch(blogsSlice.actions.updateBlog(updatedBlog))
  }
}

export const removeBlog = (blog) => {
  return async dispatch => {
    await blogService.remove(blog.id)
    dispatch(blogsSlice.actions.removeBlog(blog))
  }
}


export default blogsSlice.reducer
