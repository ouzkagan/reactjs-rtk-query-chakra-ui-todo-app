// import { useState, useEffect } from "react";
// import reactLogo from "./assets/react.svg";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchUsers } from "./features/user/userSlice";
// import { ordered, restocked } from "./features/cake/cakeSlice";
import { VStack } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { Notifications } from "./features/notification/components/Notifications";
import TodoList from "./features/todos/TodoList";
import UserLogin from "./features/user/UserLogin";
function App() {
  return (
    <VStack p={4} minHeight="100%">
      <Header />
      <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="*" element={<TodoList />} />
      </Route>
        <Route path="/profile" element={<UserLogin />} />
      </Routes>
      <Notifications />
    </VStack>
  );
}

export default App;
