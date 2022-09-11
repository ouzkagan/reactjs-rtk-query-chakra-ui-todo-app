import { Box, Center, IconButton, Text } from "@chakra-ui/react";
import { motion, useIsPresent } from "framer-motion";
import { useTimeoutFn, useUpdateEffect } from "react-use";

import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaCheckCircle, FaExclamation, FaInfoCircle } from "react-icons/fa";

import { useAppDispatch } from "../../../app/hooks/index";
import type { NotificationInterface } from "../notificationSlice";
import {
  dismissNotification,
  useNotificationDuration,
  useNotificationPosition
} from "../notificationSlice";

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

type Props = {
  notification: Notification;
};

/**
 * To handle different positions of the notification, we need to change the
 * animation direction based on whether it is rendered in the top/bottom or left/right.
 *
 * @param position - The position of the Notification
 * @param fromEdge - The length of the position from the edge in pixels
 */
const getMotionDirectionAndPosition = (position: string, fromEdge = 24) => {
  const directionPositions = ["top", "bottom"];
  const factorPositions = ["top-right", "bottom-right"];

  const direction = directionPositions.includes(position) ? "y" : "x";
  let factor = factorPositions.includes(position) ? 1 : -1;

  if (position === "bottom") factor = 1;

  return {
    [direction]: factor * fromEdge,
  };
};

const motionVariants = {
  initial: (position: string) => {
    return {
      opacity: 0,
      ...getMotionDirectionAndPosition(position),
    };
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
  exit: (position: string) => {
    return {
      opacity: 0,
      ...getMotionDirectionAndPosition(position, 30),
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1],
      },
    };
  },
};

const notificationStyleVariants = {
  success: "green.300",
  error: "red.500",
  info: "yellow.400",
  warning: "orange.300",
};

const notificationIcons = {
  success: <FaCheckCircle />,
  error: <FaExclamation />,
  info: <FaInfoCircle />,
  warning: <FaExclamation />,
};

// const closeButtonStyleVariants = {
//   success: "hover:bg-green-5 active:bg-green-6",
//   error: "hover:bg-red-5 active:bg-red-6",
//   info: "hover:bg-purple-5 active:bg-purple-6",
//   warning: "hover:bg-yellow-5 active:bg-yellow-6",
// };

export const NotificationItem = ({
  notification: { id, autoHideDuration, message, onClose, type = "info" },
}: Props) => {
  const dispatch = useAppDispatch();
  const duration = useNotificationDuration();
  const isPresent = useIsPresent();
  const position = useNotificationPosition();

  // Handle dismiss of a single notification
  const handleDismiss = () => {
    if (isPresent) {
      dispatch(dismissNotification(id));
    }
  };

  // Call the dismiss function after a certain timeout
  const [, cancel, reset] = useTimeoutFn(handleDismiss, 2500 ?? duration);

  // Reset or cancel dismiss timeout based on mouse interactions
  const onMouseEnter = () => cancel();
  const onMouseLeave = () => reset();

  // Call `onDismissComplete` when notification unmounts if present
  useUpdateEffect(() => {
    if (!isPresent) {
      onClose?.();
    }
  }, [isPresent]);

  return (
    <Box
      as={motion.li}
      display="flex"
      paddingTop="0.75rem"
      paddingBottom="0.75rem"
      paddingLeft="1rem"
      paddingRight="1rem"
      transitionProperty="background-color, border-color, color, fill, stroke"
      transitionDuration="100ms"
      fontSize="0.875rem"
      lineHeight="1.25rem"
      alignItems="center"
      width="max-content"
      borderRadius="0.25rem"
      borderWidth="1px"
      pointerEvents="auto"
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      initial="initial"
      animate="animate"
      exit="exit"
      layout="position"
      // notificationStyleVariants[type]
      bg={notificationStyleVariants[type]}
      custom={position}
      variants={motionVariants}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Box display="flex" justifyContent="center" gap="0.5rem">
        <IconButton
          aria-label="Dismiss toast"
          padding="0.25rem"
          borderRadius="0.25rem"
          transitionDuration="100ms"
          onClick={handleDismiss}
          icon={notificationIcons[type]}
          colorScheme="gray"
          variant="ghost"
        />

        <Center>
          <Text fontWeight={500} maxWidth="24rem">
            {message}
          </Text>
        </Center>
      </Box>

      <Box pl={4} ml="auto">
        <IconButton
          aria-label="Dismiss toast"
          padding="0.25rem"
          borderRadius="0.25rem"
          transitionDuration="100ms"
          onClick={handleDismiss}
          icon={<AiOutlineCloseCircle />}
          colorScheme="gray"
          variant="ghost"
        />
      </Box>
    </Box>
  );
};
