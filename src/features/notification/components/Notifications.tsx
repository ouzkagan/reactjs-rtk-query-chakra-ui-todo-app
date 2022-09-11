import { useNotifications } from '../notificationSlice';

import { NotificationInterface } from '../notificationSlice';
import { NotificationItem } from './NotificationItem';
import { NotificationList } from './NotificationList';

export interface Notification extends NotificationInterface {
  /**
   * Optional callback function to run side effects after the notification has closed.
   */
  onClose?: () => void;
  /**
   * Optionally add an action to the notification through a ReactNode
   */
  action?: React.ReactNode;
}

export const Notifications = () => {
  const notifications = useNotifications()

  return (
    <NotificationList>
      {notifications.map((notification:Notification) => (
        <NotificationItem key={notification.id} notification={notification}/>
      ))}
    </NotificationList>
  )
}