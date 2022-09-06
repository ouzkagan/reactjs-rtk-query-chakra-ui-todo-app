import {
  useGetTodosQuery,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "../api/apiSlice";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import TodoDetail from './TodoDetail'
import AddTodo from './AddTodo'


export default function TodoList() {
 const navigate = useNavigate()
  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTodosQuery();
  
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

 

  let content;
  if (isLoading) {
    content = <p>Loading..</p>;
  } else if (isSuccess) {
    content = todos.map((todo) => {
      return (
        <article key={todo.id}>
          <div className="todo">
            <input
              type="checkbox"
              checked={todo.isCompleted}
              id={todo.id}
              onChange={() =>
                updateTodo({ ...todo, isCompleted: !todo.isCompleted })
              }
            />
            <label htmlFor={todo.id}>{todo.content}</label>
            <span>
              <button
                className="trash"
                onClick={() => navigate(`/todos/${todo.id}`)}
              >
                Edit
              </button>
            </span>
            <span>
              <button
                className="trash"
                onClick={() => deleteTodo({ id: todo.id })}
              >
                Delete
              </button>
            </span>
          </div>
        </article>
      );
    });
  } else if (isError) {
    content = <p>{error}</p>;
  }
  return (
    <main>
      <AddTodo/>
      {isUpdating ? "updating please wait..." : ""}
      {content}
      <div>
        <Routes>
          <Route path="/todos/:id" element={
            <TodoDetail/>
          } />
          <Route
            element={
              <div>
                <span>Select a todo to edit!</span>
              </div>
            }
          />
        </Routes>
      </div>
    </main>
  );
}
