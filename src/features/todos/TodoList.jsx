import {
  useGetTodosQuery,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "../api/apiSlice";
import React, { useState } from "react";
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
  CheckboxGroup,
  Center,
  Flex,
  Spinner,
  Skeleton,
  Stack,
  Box,
  Button,
  SkeletonText,
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
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();
  const [deletingId, setDeletingId] = useState("");

  // detect which one is getting deleted - show spinner on delete icon
  const deleteTodoSide = (id) => {
    setDeletingId(id.id);
    deleteTodo(id);
  };

  let content;
  if (isLoading) {
    content = (
      <VStack
        divider={<StackDivider />}
        borderColor="gray.100"
        borderWidth="2px"
        p="4"
        borderRadius="lg"
        w="100%"
        maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
        minW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
        alignItems="stretch"
      >
        {Array.from(Array(10).keys()).map((todo, index) => {
          return (
            <HStack key={index}>
              <Center className={todo.isCompleted ? "done" : ""}>
                <Checkbox
                  colorScheme={todo.isCompleted ? "gray" : ""}
                  defaultChecked={todo.isCompleted}
                  id={todo.id}
                  onChange={() =>
                    updateTodo({ ...todo, isCompleted: !todo.isCompleted })
                  }
                />
              </Center>
              <Skeleton
                height="35px"
                width="100%"
                isLoaded={false}
                fadeDuration={1}
                bg="blue.500"
                color="white"
              >
                <Center>
                  <Text>{todo.content}</Text>
                </Center>
              </Skeleton>
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
    );
    // <Flex minH="50vh" alignItems="center" justifyContent="center">
    // <Spinner
    //       thickness='4px'
    //       speed='0.65s'
    //       emptyColor='gray.200'
    //       color='blue.500'
    //       size='xl'
    //     />
    // </Flex>
  } else if (isSuccess) {
    content =
      todos.length > 0 ? (
        <VStack
          divider={<StackDivider />}
          borderColor="gray.100"
          borderWidth="2px"
          p="4"
          borderRadius="3px"
          w="100%"
          maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
          minW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
          alignItems="stretch"
        >
          {todos.map((todo) => {
            return (
              <HStack
                key={todo.id}
                bg={isDeleting && deletingId == todo.id ? "red.700" : ""}
              >
                {/* <Center> */}

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
                <Center className={todo.isCompleted ? "done" : ""}>
                  <Checkbox
                    colorScheme={todo.isCompleted ? "gray" : ""}
                    defaultChecked={todo.isCompleted}
                    id={todo.id}
                    onChange={() =>
                      updateTodo({ ...todo, isCompleted: !todo.isCompleted })
                    }
                  />
                </Center>
                <Center>
                  <Text>{todo.content}</Text>
                </Center>
                <Spacer />
                <IconButton
                  icon={<FaEdit />}
                  borderRadius="3px"
                  onClick={() => navigate(`/todos/${todo.id}`)}
                />
                <IconButton
                  icon={<FaTrash />}
                  borderRadius="3px"
                  isLoading={isDeleting && deletingId == todo.id}
                  onClick={() => deleteTodoSide({ id: todo.id })}
                />
                {/* </Center> */}
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
