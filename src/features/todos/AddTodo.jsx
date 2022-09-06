import React,{useState} from 'react'
import {
  useAddTodoMutation,
} from "../api/apiSlice";
export default function AddTodo() {

  const [newTodo, setNewTodo] = useState("");

  const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();


  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo({ userId: 1, content: newTodo, isCompleted: false });
    setNewTodo("");
  };

  return (
    <form onSubmit={handleSubmit}>
    <label htmlFor="new-todo">Enter a new todo item</label>
    <div className="new-todo">
      <input
        type="text"
        id="new-todo"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter new todo"
      />
    </div>
      
    <button className="submit">submit todo {isAdding ? "(Adding your new todo...)" : ""}</button>
  </form>
  )
}
