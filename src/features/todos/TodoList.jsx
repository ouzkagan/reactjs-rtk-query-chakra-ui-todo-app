import {
  useGetTodosQuery,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "../api/apiSlice";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import TodoDetail from "./TodoDetail";
import AddTodo from "./AddTodo";
import {
  HStack,
  VStack,
  Text,
  IconButton,
  StackDivider,
  Spacer,
  Badge,
  Checkbox,
  CheckboxGroup
} from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function TodoList() {
  const navigate = useNavigate();
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
    content =
      todos.length > 0 ? (
        <VStack
          divider={<StackDivider />}
          borderColor="gray.100"
          borderWidth="2px"
          p="4"
          borderRadius="lg"
          w="100%"
          maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
          alignItems="stretch"
        >
          {todos.map((todo) => {
            return (
              <HStack key={todo.id}>
                  {/* <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    id={todo.id}
                    onChange={() =>
                      updateTodo({ ...todo, isCompleted: !todo.isCompleted })
                    }
                  /> */}
                  {/* <Checkbox
                    defaultChecked={todo.isCompleted}
                    id={todo.id}
                    onChange={() =>
                      updateTodo({ ...todo, isCompleted: !todo.isCompleted })
                    }
                  /> */}
                  <div className={todo.isCompleted ? 'done' : ''}>
                    <Checkbox colorScheme={todo.isCompleted ? 'gray' : ''} 
                      defaultChecked={todo.isCompleted}
                      id={todo.id}
                      onChange={() =>
                        updateTodo({ ...todo, isCompleted: !todo.isCompleted })
                      } />
                   </div>
                  <Text>{todo.content}</Text>
                  <Spacer />
                  <IconButton
                    icon={<FaEdit />}
                    borderRadius="3px"
                    onClick={() => navigate(`/todos/${todo.id}`)}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    borderRadius="3px"
                    onClick={() => deleteTodo({ id: todo.id })}
                    
                  />
              </HStack>
            );
          })}
        </VStack>
      ) : (
        <Badge colorScheme="green" p="4" m="4" borderRadius="lg">
          No todos, yet.
        </Badge>
      );
  } else if (isError) {
    content = <p>{error}</p>;
  }
  return (
    <main>
      <AddTodo />
      {isUpdating ? "updating please wait..." : ""}
      {content}
      <div>
        <Routes>
          <Route path="/todos/:id" element={<TodoDetail />} />
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
