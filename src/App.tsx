import { VStack } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { Notifications } from "./features/notification/components/Notifications";
import TodoList from "./features/todos/TodoList";
import UserLogin from "./features/user/UserLogin";
const App = (): JSX.Element => {
  return (
    <VStack
      p={4}
      role="app"
    >
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
