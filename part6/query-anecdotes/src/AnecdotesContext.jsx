import { useReducer, createContext, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload
    case "CLEAR":
      return ""
    default: return state
  }
}

const AnecdotesContext = createContext()

export const AnecdotesContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <AnecdotesContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </AnecdotesContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(AnecdotesContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(AnecdotesContext)
  return notificationAndDispatch[1]
}

export default AnecdotesContext
