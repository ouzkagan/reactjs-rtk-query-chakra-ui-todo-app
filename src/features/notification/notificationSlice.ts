// https://github.com/christofferbergj/medium-notifications-demo
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { useAppSelector } from "../../app/hooks/index";
import type { RootState } from "../../app/store";

export type NotificationTypes = "success" | "error" | "warning" | "info";

export interface NotificationInterface {
  id?: string | undefined;
  autoHideDuration?: number;
  message: string;
  onClose?: Function;
  type: NotificationTypes;
}

export type NotificationPositions =
  | "top"
  | "top-right"
  | "top-left"
  | "bottom"
  | "bottom-right"
  | "bottom-left";

export type NotificationsState = {
  notifications: NotificationInterface[];
  position: NotificationPositions;
  autoHideDuration: number;
};

export const initialState: NotificationsState = {
  notifications: [],
  position: "bottom-right",
  autoHideDuration: 6000,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationInterface>) => {
      const notification: NotificationInterface = {
        id: nanoid(),
        ...action.payload,
      };

      state.notifications.push(notification);
    },

    dismissNotification: (
      state,
      { payload }: PayloadAction<NotificationInterface["id"]>
    ) => {
      const index = state.notifications.findIndex(
        (notification) => notification.id === payload
      );

      if (index !== -1) {
        state.notifications.splice(index, 1);
      }
    },

    setNotificationPosition: (
      state,
      { payload }: PayloadAction<NotificationsState["position"]>
    ) => {
      state.position = payload;
    },

    setNotificationDuration: (
      state,
      { payload }: PayloadAction<NotificationsState["autoHideDuration"]>
    ) => {
      state.autoHideDuration = payload;
    },
  },
});

const { reducer, actions } = notificationsSlice;

export const {
  addNotification,
  dismissNotification,
  setNotificationPosition,
  setNotificationDuration,
} = actions;

// Selectors
const selectNotifications = (state: RootState) =>
  state?.notifications?.notifications || [];

const selectNotificationPosition = (state: RootState) =>
  state?.notifications?.position || initialState?.position || [];

const selectNotificationDuration = (state: RootState) =>
  state?.notifications?.autoHideDuration || [];

// Hooks
export const useNotificationPosition = () =>
  useAppSelector(selectNotificationPosition);

export const useNotificationDuration = () =>
  useAppSelector(selectNotificationDuration);

export const useNotifications = () => useAppSelector(selectNotifications);

export default reducer;
