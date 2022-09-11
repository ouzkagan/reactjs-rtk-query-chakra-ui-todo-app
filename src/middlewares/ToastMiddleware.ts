import { Middleware } from "redux";
import { RootState } from "../app/store";
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo
} from "../features/api/apiSlice";

import { addNotification } from "../features/notification/notificationSlice";
import { login, logout } from "../features/user/userSlice";



const ToastMiddleware: Middleware<
  {}, // Most middleware do not modify the dispatch return value
  RootState
> = (store) => (next) => (action) => {
  if (action.type == login.type) {
    // if user does't exist say registered?
    store.dispatch(
      addNotification({
        message: `Logged in successfully. Welcome ${
          store.getState().user?.user?.username
        }!`,
        type: "success",
      })
    );
  }
  if (action.type == logout.type) {
    // if user does't exist say registered?
    store.dispatch(
      addNotification({
        message: `Logged out successfully.`,
        type: "success",
      })
    );
  }

  if (addTodo.matchPending(action)) {
    // directly opening toast or dispatching addNotification?
    console.log("Todo added optimistically. Waiting for server reponse.");
    store.dispatch(
      addNotification({
        message: `Todo added optimistically. Waiting for server reponse.`,
        type: "info",
      })
    );
  }
  if (addTodo.matchFulfilled(action)) {
    // directly opening toast or dispatching addNotification?
    console.log("Todo added optimistically. Waiting for server reponse.");
    store.dispatch(
      addNotification({
        message: `Add todo ended successfully.`,
        type: "success",
      })
    );
  }
  if (getTodos.matchFulfilled(action)) {
    console.log("Todos retrieved successfully. ");
    store.dispatch(
      addNotification({
        message: `Todos retrieved successfully!`,
        type: "success",
      })
    );
  }
  if (updateTodo.matchPending(action)) {
    console.log("todo updated optimistically. waiting server response. ");
    store.dispatch(
      addNotification({
        message: `Todo updated optimistically. Waiting for server response...`,
        type: "info",
      })
    );
  }
  if (updateTodo.matchFulfilled(action)) {
    console.log("update todo ended successfully");
    store.dispatch(
      addNotification({
        message: `Todo updated successfully!`,
        type: "success",
      })
    );
  }
  if (deleteTodo.matchPending(action)) {
    store.dispatch(
      addNotification({
        message: `Deleting todo started.`,
        type: "info",
      })
    );
  }
  if (deleteTodo.matchFulfilled(action)) {
    store.dispatch(
      addNotification({
        message: `Todo deleted successfully!`,
        type: "success",
      })
    );
  }
  // if (getTodos.matchRejected(action)) {
  //   console.log(action);
  // }

  if (action.type.includes("rejected")) {
    if (action.error.message == "Rejected") {
      store.dispatch(
        addNotification({
          message: `Server problem. ${
            action.payload && "Error: " + action?.payload?.data
          } `,
          type: "warning",
        })
      );
    }
  }

  return next(action);
};
// export ToastMiddleware
export default ToastMiddleware;
