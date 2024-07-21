const totalLikes = blogs =>
  blogs.reduce((res, blog) => res + blog.likes, 0)


const favoriteBlog = blogs => {
  if (blogs.length === 0) return null

  return blogs.reduce((res, blog) =>
    blog.likes > res.likes ? blog : res, blogs[0])
}


const mostBlogs = blogs => {
  if (blogs.length === 0) return null

  return Object.entries(blogs
    .reduce((counts, curr) => {
      counts[curr.author] = (counts[curr.author] ?? 0) + 1
      return counts
    }, {}))
    .reduce((res, [author, blogs]) =>
      blogs < res.blogs ? res : { author, blogs }
    , {})
}


const mostLikes = blogs => {
  if (blogs.length === 0) return null

  return Object.entries(blogs
    .reduce((counts, curr) => {
      counts[curr.author] = (counts[curr.author] ?? 0) + curr.likes
      return counts
    }, {}))
    .reduce((res, [author, likes]) =>
      likes < res.likes ? res : { author, likes }
    , {})
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}