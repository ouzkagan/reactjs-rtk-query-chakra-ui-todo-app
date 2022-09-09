import { addTodo, deleteTodo, getTodos, updateTodo } from "../features/api/apiSlice";

const ToastMiddleware = () => (next) => (action) => {
  console.log(getTodos.matchFulfilled(action));
  // console.log(useAddTodoMutation());
  if(addTodo.matchPending(action)){
    // directly opening toast or dispatching addNotification?
    console.log('Todo added optimistically. Waiting for server reponse.')
  }
  if(getTodos.matchFulfilled(action)){
    console.log('Todos retrieved successfully. ')
  }
  if(updateTodo.matchPending(action)){
    console.log('todo updated optimistically. waiting server response. ')
  }
  if(updateTodo.matchFulfilled(action)){
    console.log('update todo ended successfully')
  }
  if(deleteTodo.matchPending(action)){
    console.log('deleting todo.')
  }
  if(deleteTodo.matchFulfilled(action)){
    console.log('todo deleted successfully')
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
