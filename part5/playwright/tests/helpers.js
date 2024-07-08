const logIn = async (page, {username, password}) => {
  await page.getByTestId('LoginForm:input:username').fill(username)
  await page.getByTestId('LoginForm:input:password').fill(password)
  await page.getByTestId('LoginForm:button:login').click()
}

const addBlog = async (page, {title, author, url}) => {
  await page.getByRole('button', {name: 'new blog'}).click()
  await (page.getByTestId('NewBlogForm:input:title')).fill(title)
  await (page.getByTestId('NewBlogForm:input:author')).fill(author)
  await (page.getByTestId('NewBlogForm:input:url')).fill(url)
  await page.getByRole('button', {name: 'Create'}).click()
  await page.locator('.blog-entry').getByText(title).waitFor()
}

module.exports = { logIn, addBlog }
