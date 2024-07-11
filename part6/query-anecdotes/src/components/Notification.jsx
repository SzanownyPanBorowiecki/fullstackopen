import { useContext } from 'react'
import { useNotificationValue } from '../AnecdotesContext'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  const message = useNotificationValue()

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification
