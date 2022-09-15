import type {
  NotificationInterface,
  NotificationsState
} from "./notificationSlice";
import NotificationReducer, {
  addNotification,
  dismissNotification,
  initialState,
  setNotificationDuration,
  setNotificationPosition
} from "./notificationSlice";

const mockNotifications: NotificationInterface[] = [
  {
    id: "1",
    message: "Sucess notification.",
    type: "success",
  },
  {
    id: "2",
    message: "Info notification.",
    type: "info",
  },
  {
    id: "3",
    message: "Warning notification.",
    type: "warning",
  },
  {
    id: "4",
    message: "Error notification.",
    type: "error",
  },
];

// jest.mock("nanoid");

// const mnanoid = mocked(nanoid);

describe("notification reducer", () => {
  it("should be return the inital state when passed an empty action", () => {
    const action = { type: "" };
    const result = NotificationReducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  // it("should create notification", () => {
  //   const initialState = undefined;
  //   const action = addNotification(mockNotification);
  //   const result = NotificationReducer(initialState, action);
  // });

  test("should handle a notification being added to an notification list", () => {
    const previousState: NotificationsState = {
      notifications: [],
      position: "bottom-right",
      autoHideDuration: 6000,
    };

    // mnanoid.mockReturnValueOnce("mock id");

    expect(
      NotificationReducer(previousState, addNotification(mockNotifications[0]))
    ).toEqual({
      notifications: [
        {
          ...mockNotifications[0],
          id: expect.anything(),
        },
      ],
      position: "bottom-right",
      autoHideDuration: 6000,
    });
  });

  test("should handle a multiple notification being added to a notification list", () => {
    const previousState: NotificationsState = {
      notifications: [],
      position: "bottom-right",
      autoHideDuration: 6000,
    };

    // mnanoid.mockReturnValueOnce("mock id");

    let action;
    let result = NotificationReducer(
      previousState,
      addNotification(mockNotifications[0])
    );
    action = addNotification(mockNotifications[1]);
    result = NotificationReducer(result, addNotification(mockNotifications[1]));
    action = addNotification(mockNotifications[2]);
    result = NotificationReducer(result, addNotification(mockNotifications[2]));
    action = addNotification(mockNotifications[3]);
    result = NotificationReducer(result, addNotification(mockNotifications[3]));

    expect(Object.keys(result.notifications).length).toEqual(
      mockNotifications.length
    );

    mockNotifications.forEach((notification: NotificationInterface, index) => {
      expect(result.notifications[index]).toEqual({
        ...notification,
        id: expect.anything(),
      });
    });
  });
  test("should handle a multiple notification being removed to an notification list", () => {
    const previousState: NotificationsState = {
      notifications: [...mockNotifications],
      position: "bottom-right",
      autoHideDuration: 6000,
    };

    // mnanoid.mockReturnValueOnce("mock id");

    let result = NotificationReducer(
      previousState,
      dismissNotification(mockNotifications[0].id)
    );
    result = NotificationReducer(
      result,
      dismissNotification(mockNotifications[1].id)
    );
    result = NotificationReducer(
      result,
      dismissNotification(mockNotifications[2].id)
    );
    result = NotificationReducer(
      result,
      dismissNotification(mockNotifications[3].id)
    );

    // expect(Object.keys(result.notifications).length).toEqual(
    //   0
    // );
    expect(result).toEqual(initialState);
  });

  it("should set notification position", () => {
    const previousState: NotificationsState = {
      notifications: [...mockNotifications],
      position: "bottom-right",
      autoHideDuration: 6000,
    };

    // mnanoid.mockReturnValueOnce("mock id");

    let action = setNotificationPosition("top-right");
    let result = NotificationReducer(previousState, action);

    expect(result).toEqual({
      ...previousState,
      position: "top-right",
    });
  });
  it("should set notification position", () => {
    const previousState: NotificationsState = {
      notifications: [...mockNotifications],
      position: "bottom-right",
      autoHideDuration: 6000,
    };

    // mnanoid.mockReturnValueOnce("mock id");

    let action = setNotificationPosition("top-right");
    let result = NotificationReducer(previousState, action);

    expect(result).toEqual({
      ...previousState,
      position: "top-right",
    });
  });
  it("should set notification duration", () => {
    const previousState: NotificationsState = {
      notifications: [...mockNotifications],
      position: "bottom-right",
      autoHideDuration: 6000,
    };

    // mnanoid.mockReturnValueOnce("mock id");

    let action = setNotificationDuration(1500);
    let result = NotificationReducer(previousState, action);

    expect(result).toEqual({
      ...previousState,
      autoHideDuration: 1500,
    });
  });
});
