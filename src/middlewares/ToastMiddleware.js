import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo
} from "../features/api/apiSlice";

import { addNotification } from "../features/notification/notificationSlice";
import { login } from "../features/user/userSlice";

const ToastMiddleware = (store) => (next) => (action) => {
  if (action.type == login.type) {
    // if user does't exist say registered?
    store.dispatch(
      addNotification({
        message: `Logged in successfully.`,
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
  if (getTodos.matchRejected(action)) {
    console.log(action);
  }

  if (action.type.includes("rejected")) {
    if (action.error.name == "rejected") {
      store.dispatch(
        addNotification({
          message: `Server is not responding. Try again later.`,
          type: "warning",
        })
      );
    }
  }

  // switch (action.type) {
  //   // case (updateTodo.matchPending(action))
  //   case "user/login":
  //     // if user logged in: (i) New information saved successfully
  //     // if user logged out: (i) Logged out successfully
  //     console.log("update mutation pending: toast: optimistic update done");
  //     break;
  //   case (action.type.includes('api')):

  //   case "api/executeMutation/pending":
  //     console.log("update mutation pending: toast: optimistic update done");
  //     break;
  //   case "api/executeMutation/fulfilled":
  //     console.log(
  //       "update mutation fulfilled: toast: success response from server"
  //     );
  //     break;
  //   default:
  //     // console.log("deafult response");
  // }
  // console.log('fulfilled')
  return next(action);
};

export default ToastMiddleware;
