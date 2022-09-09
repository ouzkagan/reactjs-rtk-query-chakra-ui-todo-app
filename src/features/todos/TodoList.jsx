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
  Select,
  Skeleton,
  Spacer,
  Spinner,
  Stack,
  StackDivider,
  Text,
  VStack
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Route, Routes, useNavigate } from "react-router-dom";

import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import Pagination from "../../components/Pagination";
import {
  useDeleteTodoMutation,
  useGetTodosQuery,
  useUpdateTodoMutation
} from "../api/apiSlice";
import AddTodo from "./AddTodo";
import TodoDetail from "./TodoDetail";

// setNotificationDuration,

import { useAppDispatch } from '../../app/hooks/index';

const Filters = ({ filter, setFilter,isLoading }) => {
  const filters = ["All", "Active", "Completed"];

  if(isLoading == true){
    return (
      <Select
      variant="filled"
      size="xs"
      onChange={(e) => setFilter(parseInt(e.target.value))}
      placeholder="Loading.."
    />
    )
  }
  return (
    // shorthand using the `Flex` component
    <Select
      variant="filled"
      size="xs"
      onChange={(e) => setFilter(parseInt(e.target.value))}
      
    >
      {filters.map((item, index) => {
        return (
          <option value={index} key={item}>
            {" "}
            {item}
          </option>
        );
      })}
    </Select>

    // <Flex align="center" justify="flex-end" m="6">
    //   {filters.map((item, index) => {
    //     return (
    //       <Button
    //         colorScheme={index === filter ? "cyan" : "blue"}
    //         px="4"
    //         m="2"
    //         onClick={() => setFilter(index)}
    //         key={item}
    //       >
    //         {item}
    //       </Button>
    //     );
    //   })}
    //   {/* <Button colorScheme="blue" px="4" m="2" onClick={() => setFilter(1)}>
    //     Completed
    //   </Button>
    //   <Button colorScheme="blue" px="4" m="2" onClick={() => setFilter(2)}>
    //     Not Completed
    //   </Button> */}
    // </Flex>
  );
};
let PageSize = 10;

export default function TodoList() {
  // filter
  const [filter, setFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [todoCount, setTodoCount] = useState(0);
  // router
  const navigate = useNavigate();

  // rtk
  const dispatch = useAppDispatch()
  // const position = useNotificationPosition()

  const { user } = useSelector((state) => state.user);

  // Alternative reselect create selector approach for filtering -- RTK Query filters
  const selectCompletedTodos = useMemo(() => {
    const emptyArray = [];
    // Return a unique selector instance for this page so that
    // the filtered results are correctly memoized
    return createSelector(
      (inputData) => inputData,
      (data) =>
        data?.data?.filter((todo) => todo.isCompleted === true) ?? emptyArray
    );
  }, []);

  const selectInCompletedTodos = useMemo(() => {
    const emptyArray = [];
    // Return a unique selector instance for this page so that
    // the filtered results are correctly memoized
    return createSelector(
      (inputData) => inputData,
      (data) =>
        data?.data?.filter((todo) => todo.isCompleted === false) ?? emptyArray
    );
  }, []);

  // Queries and Mutations
  const {
    data: todos,
    completedTodos,
    inCompletedTodos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTodosQuery(undefined, {
    selectFromResult: (result) => ({
      // We can optionally include the other metadata fields from the result here
      ...result,
      // Include a field called `filteredData` in the result object,
      // and memoize the calculation
      completedTodos: selectCompletedTodos(result),
      inCompletedTodos: selectInCompletedTodos(result),
    }),
  });

  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();
  const [deletingId, setDeletingId] = useState("");

  // detect which one is getting deleted - show spinner on delete icon
  const deleteTodoSide = (id) => {
    setDeletingId(id.id);
    deleteTodo(id);
  };

  // paginated data

  const paginatedTodos = useMemo(() => {
    let filterType;
    if (filter == 0) {
      filterType = (item) => {
        return true;
      };
    }
    if (filter == 1) {
      filterType = (item) => {
        return item?.isCompleted == false;
      };
    }
    if (filter == 2) {
      filterType = (item) => {
        return item?.isCompleted == true;
      };
    }
    if (todos === undefined) return [];
    let data = [...todos.filter((item) => filterType(item))];
    setTodoCount(data.length);

    // if there is less page in new filtered data set data to existing page
    if (currentPage > Math.ceil(data.length / PageSize)) {
      setCurrentPage(1);
    }
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [todos, filter, currentPage]);

  // useEffect(() => {
  //   handleFilters();
  //   return () => {
  //     handleFilters();
  //   };
  // }, [filter, isUpdating, isDeleting]);

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
          <Button ml="4" onClick={() => navigate("/profile")}>
            Login
          </Button>
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
        <Flex justifyContent="space-between" pb="1">
          <Stack direction="row">
            <Badge alignSelf="center">
              All: <Spinner size="xs" />
            </Badge>
            <Badge alignSelf="center" colorScheme="purple">
              Active: <Spinner size="xs" />
            </Badge>
            <Badge alignSelf="center" colorScheme="green">
              Completed: <Spinner size="xs" />
            </Badge>
          </Stack>
          <Stack maxW="50%">
            {/* <Select placeholder="All" variant="filled" size="xs">
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </Select> */}
            <Filters setFilter={setFilter} filter={filter} isLoading={true} />
          </Stack>
        </Flex>
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
    // let filterType;
    // if(filter == 0){
    //   filterType = (item) => {
    //     return true
    //   }
    // }
    // if(filter == 1){
    //   filterType = (item) => {
    //     return item?.isCompleted == true
    //   }
    // }
    // if(filter == 2){
    //   filterType = (item) => {
    //     return item?.isCompleted == false

    //   }
    // }
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
          <Flex justifyContent="space-between" pb="1">
            <Stack direction="row">
              <Badge alignSelf="center">All: {todos.length}</Badge>
              <Badge alignSelf="center" colorScheme="purple">
                Active: {inCompletedTodos.length}
              </Badge>
              <Badge alignSelf="center" colorScheme="green">
                Completed: {completedTodos.length}
              </Badge>
            </Stack>
            <Stack maxW="50%">
              {/* <Select placeholder="All" variant="filled" size="xs">
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </Select> */}
              <Filters setFilter={setFilter} filter={filter} />
            </Stack>
          </Flex>
          {paginatedTodos.map((todo) => {
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
                    onChange={() =>{
                     
                      updateTodo({ ...todo, isCompleted: !todo.isCompleted })
                    }}
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
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={todoCount}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
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
      {/* <Filters setFilter={setFilter} filter={filter} /> */}
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
