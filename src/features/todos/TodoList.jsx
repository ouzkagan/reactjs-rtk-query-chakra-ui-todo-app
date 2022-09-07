import {
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Spacer,
  StackDivider,
  Text,
  VStack
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Route, Routes, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import {
  useDeleteTodoMutation,
  useGetTodosQuery,
  useUpdateTodoMutation
} from "../api/apiSlice";

import AddTodo from "./AddTodo";
import TodoDetail from "./TodoDetail";

const Filters = () => {
  return (
    // shorthand using the `Flex` component
    <Flex align="center" justify="flex-end" m="6">
      <Button colorScheme="blue" px="4" m="2">
        All
      </Button>
      <Button colorScheme="blue" px="4" m="2">
        Completed
      </Button>
      <Button colorScheme="blue" px="4" m="2">
        Not Completed
      </Button>
    </Flex>
  );
};

export default function TodoList() {
  // router
  const navigate = useNavigate();
  // rtk query

  // const allPosts = useMemo(() => {
  //   const emptyArray = []
  //   // Return a unique selector instance for this page so that
  //   // the filtered results are correctly memoized
  //   return createSelector(
  //     res => res.data,
  //     (res, userId) => userId,
  //     (data, userId) => data?.filter(post => post.user === userId) ?? emptyArray
  //   )
  // }, [])
  const { user } = useSelector((state) => state.user);

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
  if (!user?.username) {
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
        <Box textAlign="center" size="2xl" p="10">
          You must be logged in to see this content{" "}
          <Button ml="4" onClick={() => navigate("/profile")}>Login</Button>
        </Box>
      </VStack>
    );
  } else if (isLoading) {
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
                  <Text> {todo.content}</Text>
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
                borderRadius="3px"
                p="1"
                w="100%"
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
                    // defaultChecked={todo.isCompleted}
                    isChecked={todo.isCompleted}
                    id={todo.id}
                    key={todo.id}
                    onChange={() =>
                      updateTodo({ ...todo, isCompleted: !todo.isCompleted })
                    }
                    isDisabled={todo.id.includes("temp")}
                    // size="lg"
                  />
                </Center>
                <Center>
                  <Text as={todo.isCompleted ? "em" : ""}>
                    <Text
                      textAlign="left"
                      as={todo.isCompleted ? "del" : "samp"}
                      noOfLines={[1, 2, 3]}
                      maxWidth="400px"
                      // fontSize='lg'
                    >
                      {todo.content}
                    </Text>
                  </Text>
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
      <Heading mg="8" fontWeight="extrabold" size="2xl">
        Todos
      </Heading>
      <AddTodo />
      <Filters />
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
