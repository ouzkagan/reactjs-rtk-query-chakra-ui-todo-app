import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "./features/user/userSlice";
import { ordered, restocked } from "./features/cake/cakeSlice";
import TodoList from "./features/todos/TodoList";
import { Routes, Route } from "react-router-dom";
import { Heading, VStack, IconButton } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
function App() {
  // const user = useSelector((state) => state.user)
  // const numOfCakes = useSelector((state) => state.cake.numOfCakes)
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(fetchUsers())
  // }, [])

  return (
    <VStack p={4}>
      <IconButton
        borderRadius='3px'
        size="lg"
        alignSelf="flex-end"
        icon = {colorMode === 'light' ? <FaMoon /> : <FaSun />}
        ariaLabel= 'Switch DarkMode'
      />
      <Heading mg='8' fontWeight="extrabold" size="2xl">My Todo App</Heading>

      <Routes>
        <Route path="*" element={<TodoList />} />
      </Routes>
    </VStack>
  );
}

export default App;
