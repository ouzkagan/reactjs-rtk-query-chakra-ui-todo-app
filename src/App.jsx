// import { useState, useEffect } from "react";
// import reactLogo from "./assets/react.svg";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchUsers } from "./features/user/userSlice";
// import { ordered, restocked } from "./features/cake/cakeSlice";
import { VStack } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import { Notifications } from "./features/notification/components/Notifications";
import TodoList from "./features/todos/TodoList";
import UserLogin from "./features/user/UserLogin";


function App() {

  // const user = useSelector((state) => state.user)
  // const numOfCakes = useSelector((state) => state.cake.numOfCakes)
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(fetchUsers())
  // }, [])

  return (
    <VStack p={4} minHeight="100%">
      
        <Header />
      <Routes>
        <Route path="*" element={<TodoList />} />
        <Route path="/profile" element={<UserLogin />} />
      </Routes>
      <Notifications />
    </VStack>
  );
}

export default App;
