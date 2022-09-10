import { List } from '@chakra-ui/react'
import * as Portal from '@radix-ui/react-portal'
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import {
  useNotificationPosition
} from '../notificationSlice'



  
const positions = {
  'top': {
    top:"0",
    right:"0",
    left:"0",
    alignItems:"center"
  },
  'top-right': {
    top:"0",
    right:"0",
    alignItems:"flex-end"
  },
  'top-left': {
    top:"0",
    left:"0",
    alignItems:"flex-start"
  }
  ,
  'bottom': {
    bottom:"0",
    right:"0",
    left:"0",
    alignItems:"center"
  }
  ,
  'bottom-left': {
    bottom:"0",
    left:"0",
    alignItems:"flex-start"
  }
  ,
  'bottom-right': {
    bottom:"0",
    right:"0",
    alignItems:"flex-end"
  }
  
}


export const NotificationList = ({ children }) => {
  const position = useNotificationPosition()

  return (
    <Portal.Root>
      <AnimateSharedLayout>
        <List
          // ariaLive="assertive"
          // className={clsx(
          //   'notification-list bottom-right'
          // )}

          display='flex'
          position='fixed'
          zIndex='50'
          m='1rem'
          flexDirection='column'
          pointerEvents='none'
          gap='1rem'
          {...positions[position]}
        >
          <AnimatePresence initial={false}>{children}</AnimatePresence>
        </List>
      </AnimateSharedLayout>
    </Portal.Root>
  )
}