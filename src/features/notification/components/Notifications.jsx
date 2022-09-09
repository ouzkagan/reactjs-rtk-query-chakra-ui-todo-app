import { useNotifications } from '../notificationSlice'

import { NotificationItem } from '../components/NotificationItem'
import { NotificationList } from '../components/NotificationList'

export const Notifications = () => {
  const notifications = useNotifications()

  return (
    <NotificationList>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </NotificationList>
  )
}