// https://github.com/christofferbergj/medium-notifications-demo
import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

import { useAppSelector } from '../../app/hooks/index'


const initialState = {
  notifications: [],
  position: 'bottom-right',
  autoHideDuration: 6000,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state,{payload}) =>{
      const notification = {
        id: nanoid(),
        ...payload,
      }

      state.notifications.push(notification)
    },
   
    dismissNotification: (
      state,
      { payload }
    ) => {
      const index = state.notifications.findIndex(
        (notification) => notification.id === payload
      )

      if (index !== -1) {
        state.notifications.splice(index, 1)
      }
    },
    setNotificationPosition: (
      state,
      { payload }
    ) => {
      state.position = payload
    },
    setNotificationDuration: (
      state,
      { payload }
    ) => {
      state.autoHideDuration = payload
    },
  },
})

const { reducer, actions } = notificationsSlice

export const {
  addNotification,
  dismissNotification,
  setNotificationPosition,
  setNotificationDuration,
} = actions

// Selectors
const selectNotifications = (state) =>
  state?.notifications?.notifications || []

const selectNotificationPosition = (state) =>
  state?.notifications?.position || initialState?.position || []

const selectNotificationDuration = (state) =>
  state?.notifications?.autoHideDuration || []

// Hooks
export const useNotificationPosition = () =>
  useAppSelector(selectNotificationPosition)

export const useNotificationDuration = () =>
  useAppSelector(selectNotificationDuration)

export const useNotifications = () => useAppSelector(selectNotifications)

export default reducer