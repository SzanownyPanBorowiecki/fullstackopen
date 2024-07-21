import { useState, useEffect } from 'react'

const Notification = ({notification}) => {
  const [notificationTimeout, setNotificationTimeout] = useState(null)

  useEffect(() => {
    clearTimeout(notificationTimeout)
    setNotificationTimeout(
      setTimeout(() => {
        setNotificationTimeout(null)
      }, 5000))
  }, [notification])

  if (!notificationTimeout) return null
  return (notification &&
    <div className={notification.type}>{notification.message}</div>
  )
}

export default Notification
