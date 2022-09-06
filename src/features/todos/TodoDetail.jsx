import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetTodoQuery,useGetTodosQuery,useUpdateTodoMutation } from "../api/apiSlice";

export default function TodoDetail() {
  const { id } = useParams();
  const navigate = useNavigate()
  
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  
  // Previous approach replaced with selectFromResult 
  //const {
  //   data: singleTodo,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error,
  //   isFetching
  // } = useGetTodoQuery(id);

  // let content;

  // if (isFetching) {
  //   content = <div>Loading...</div>
  // } else if (isSuccess) {
  //   content = <div>
  //     {isFetching ? <div>Todo is loading!!</div> :
  //       JSON.stringify(singleTodo)
  //     }
  //   </div>
  // } else if (isError) {
  //   content = <div>{error.toString()}</div>
  // }



  //We can just take data from existing query. There is no need to fetch individual todo again. 
  const { todo } = useGetTodosQuery(undefined, {
    selectFromResult: ({data}) => ({
      todo: data?.find((todo) => todo.id === id),
    }),
  })
  const [newContent, setNewContent] = useState('')


  let content;
  if(!!todo){
    content =  <div>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        id={todo.id}
        onChange={() =>
          updateTodo({ ...todo, isCompleted: !todo.isCompleted })
        }
      />
      <input type="text" value={newContent || todo.content} onChange={(e)=>setNewContent(e.target.value)}/>
    </div>
  }

  return (
      <div className="popup">
        <div>TodoDetail</div>
        {content}
      <button onClick={() => updateTodo({ ...todo, content: newContent || todo.content })}>update</button>
      <button onClick={() => navigate(`/`)}>close</button>
    </div>
  );
}
