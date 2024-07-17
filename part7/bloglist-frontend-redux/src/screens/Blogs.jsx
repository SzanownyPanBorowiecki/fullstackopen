import { useSelector } from 'react-redux'
import BlogList from '#components/Blogs/BlogList'

const Blogs = () => {
  // should initialize blogs here

  const blogs = useSelector(state => state.blogs)
  return <BlogList blogs={blogs} />
}

export default Blogs
