import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "./features/user/userSlice";
import { ordered, restocked } from "./features/cake/cakeSlice";
import TodoList from "./features/todos/TodoList";
import { Routes, Route } from "react-router-dom";
import { Heading, VStack } from "@chakra-ui/react";

function App() {
  // const user = useSelector((state) => state.user)
  // const numOfCakes = useSelector((state) => state.cake.numOfCakes)
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(fetchUsers())
  // }, [])

  return (
    <VStack>
      <Heading>My Todo App</Heading>

      <Routes>
        <Route path="*" element={<TodoList />} />
      </Routes>
    </VStack>
    
      {/* number of cakes {numOfCakes} */}
      {/* <button onClick={() => dispatch(ordered())}>order cake</button>
      <button onClick={() => dispatch(restocked(5))}>restock cake</button>
      <button onClick={() => dispatch(fetchUsers())}>get users</button>
      <div>
        {user.loading && <div>Users are loading</div>}
        {!user.loading && user.error ? <div>error {user.error}</div> :null }
        {!user.loading && user.users.length ? (
            user.users.map(user => (
              <li key={user.id}>{user.name}</li>
            )

          )
        ) 
        : null
      }

      </div> */}
  );
}

export default App;
