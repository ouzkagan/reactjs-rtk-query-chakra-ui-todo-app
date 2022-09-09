import clsx from 'clsx'
import { motion, useIsPresent } from 'framer-motion'
import { useTimeoutFn, useUpdateEffect } from 'react-use'

import { FaCheckCircle, FaExclamation, FaInfoCircle, FaXbox } from 'react-icons/fa'

import { useAppDispatch } from '../../../app/hooks/index'
import {
  dismissNotification, useNotificationDuration,
  useNotificationPosition
} from '../notificationSlice'


/**
 * To handle different positions of the notification, we need to change the
 * animation direction based on whether it is rendered in the top/bottom or left/right.
 *
 * @param position - The position of the Notification
 * @param fromEdge - The length of the position from the edge in pixels
 */
const getMotionDirectionAndPosition = (
  position,
  fromEdge = 24
) => {
  const directionPositions = ['top', 'bottom']
  const factorPositions = ['top-right', 'bottom-right']

  const direction = directionPositions.includes(position) ? 'y' : 'x'
  let factor = factorPositions.includes(position) ? 1 : -1

  if (position === 'bottom') factor = 1

  return {
    [direction]: factor * fromEdge,
  }
}

const motionVariants = {
  initial: (position) => {
    return {
      opacity: 0,
      ...getMotionDirectionAndPosition(position),
    }
  },
  animate: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: (position) => {
    return {
      opacity: 0,
      ...getMotionDirectionAndPosition(position, 30),
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    }
  },
}

const notificationStyleVariants= {
  success: 'bg-green-3 border-green-6',
  error: 'bg-red-3 border-red-6',
  info: 'bg-purple-3 border-purple-6',
  warning: 'bg-yellow-3 border-yellow-6',
}

const notificationIcons = {
  success: <FaCheckCircle />,
  error: <FaExclamation />,
  info: <FaInfoCircle />,
  warning: <FaExclamation />,
}

const closeButtonStyleVariants= {
  success: 'hover:bg-green-5 active:bg-green-6',
  error: 'hover:bg-red-5 active:bg-red-6',
  info: 'hover:bg-purple-5 active:bg-purple-6',
  warning: 'hover:bg-yellow-5 active:bg-yellow-6',
}

export const NotificationItem = ({
  notification: { id, autoHideDuration, message, onClose, type = 'info' },
}) => {
  const dispatch = useAppDispatch()
  const duration = useNotificationDuration()
  const isPresent = useIsPresent()
  const position = useNotificationPosition()

  // Handle dismiss of a single notification
  const handleDismiss = () => {
    if (isPresent) {
      dispatch(dismissNotification(id))
    }
  }

  // Call the dismiss function after a certain timeout
  const [, cancel, reset] = useTimeoutFn(
    handleDismiss,
    autoHideDuration ?? duration
  )

  // Reset or cancel dismiss timeout based on mouse interactions
  const onMouseEnter = () => cancel()
  const onMouseLeave = () => reset()

  // Call `onDismissComplete` when notification unmounts if present
  useUpdateEffect(() => {
    if (!isPresent) {
      onClose?.()
    }
  }, [isPresent])

  return (
    <motion.li
      className={clsx(
        'flex w-max items-center shadow px-4 py-3 rounded border transition-colors duration-100 min-w-[260px] text-sm pointer-events-auto',
        notificationStyleVariants[type]
      )}
      initial="initial"
      animate="animate"
      exit="exit"
      layout="position"
      custom={position}
      variants={motionVariants}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex gap-2 items-center">
        {notificationIcons[type]}
        <span className="max-w-sm font-medium">{message}</span>
      </div>

      <div className="pl-4 ml-auto">
        <button
          onClick={handleDismiss}
          className={clsx(
            'p-1 rounded transition-colors duration-100',
            closeButtonStyleVariants[type]
          )}
        >
          <FaXbox />
        </button>
      </div>
    </motion.li>
  )
}