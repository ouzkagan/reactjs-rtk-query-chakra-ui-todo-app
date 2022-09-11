import {
  Badge,
  Center,
  Checkbox,
  Flex,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Spacer,
  Spinner,
  Stack,
  StackDivider,
  Text,
  VStack
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Route, Routes, useNavigate } from "react-router-dom";

import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import Pagination from "../../components/Pagination";
import {
  useDeleteTodoMutation,
  useGetTodosQuery,
  useUpdateTodoMutation
} from "../api/apiSlice";
import type { Todo } from "../types";
import AddTodo from "./AddTodo";
import TodoDetail from "./TodoDetail";
// setNotificationDuration,

import Filters from "./Filters";
let PageSize = 10;

export default function TodoList() {
  // filter
  const [filter, setFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [todoCount, setTodoCount] = useState(0);
  // router
  const navigate = useNavigate();

  // Redux toolkit

  // Alternative reselect create selector approach for filtering -- RTK Query filters
  const selectCompletedTodos = useMemo(() => {
    const emptyArray: any = [];
    return createSelector(
      (inputData: any) => inputData,
      (data: RootState) =>
        data?.data?.filter((todo: Todo) => todo.isCompleted === true) ?? []
    );
  }, []);

  const selectInCompletedTodos = useMemo(() => {
    const emptyArray = [];
    return createSelector(
      (inputData: any) => inputData,
      (data: RootState) =>
        data?.data?.filter((todo: Todo) => todo.isCompleted === false) ?? []
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
      ...result,
      completedTodos: selectCompletedTodos(result),
      inCompletedTodos: selectInCompletedTodos(result),
    }),
  });

  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();
  const [deletingId, setDeletingId] = useState<number>(-1);

  // detect which one is getting deleted - show spinner on delete icon
  const deleteTodoSide = (todo: Todo) => {
    setDeletingId(todo.id);
    deleteTodo({ id: todo.id });
  };

  // paginated data
  const paginatedTodos = useMemo(() => {
    let filterType = (item: Todo): boolean => {
      return true;
    };

    if (filter == 0) {
      filterType = (item) => {
        return true;
      };
    }
    if (filter == 1) {
      filterType = (item: Todo) => {
        return item?.isCompleted == false;
      };
    }
    if (filter == 2) {
      filterType = (item: Todo) => {
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
            <Filters setFilter={setFilter} isLoading={true} />
          </Stack>
        </Flex>
        {Array.from(Array(10).keys()).map((todo, index) => {
          return (
            <HStack key={index}>
              <Center>
                <Checkbox
                  colorScheme={""}
                  defaultChecked={false}
                  // id={todo.id}
                  // onChange={() =>
                  //   updateTodo({ ...todo, isCompleted: !todo.isCompleted })
                  // }
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
                  <Text> {""}</Text>
                </Center>
              </Skeleton>
              <Spacer />
              <IconButton
                aria-label="Edit Todo"
                icon={<FaEdit />}
                borderRadius="3px"
                // onClick={() => navigate(`/todos/${todo.id}`)}
              />
              <IconButton
                aria-label="Delete Todo"
                icon={<FaTrash />}
                borderRadius="3px"
                // onClick={() => deleteTodo({ id: todo.id })}
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
              <Filters setFilter={setFilter} isLoading={false} />
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
                    id={todo.id.toString()}
                    key={todo.id}
                    onChange={() => {
                      updateTodo({ ...todo, isCompleted: !todo.isCompleted });
                    }}
                    isDisabled={todo.id.toString().includes("temp")}
                    // size="lg"
                  />
                </Center>
                <Center>
                  <Text
                    // @ts-ignore:
                    as={todo.isCompleted ? "em" : ""}
                  >
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
                  aria-label="Edit todo"
                  icon={<FaEdit />}
                  borderRadius="3px"
                  onClick={() => navigate(`/todos/${todo.id}`)}
                  isDisabled={todo.id.toString().includes("temp")}
                />
                <IconButton
                  aria-label="Delete todo"
                  icon={<FaTrash />}
                  borderRadius="3px"
                  isLoading={isDeleting && deletingId == todo.id}
                  onClick={() => deleteTodoSide(todo)}
                  isDisabled={todo.id.toString().includes("temp")}
                />
                {/* </Center> */}
              </HStack>
            );
          })}
          <Pagination
            // className="pagination-bar"
            currentPage={currentPage}
            totalCount={todoCount}
            pageSize={PageSize}
            siblingCount={1}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </VStack>
      ) : (
        <Badge colorScheme="green" p="4" m="4" borderRadius="lg">
          No todos, yet.
        </Badge>
      );
  } else if (isError) {
    // @ts-ignore:
    content = <p>{error}</p>;
  }
  return (
    <main>
      <Heading
        // @ts-ignore:
        mg="8"
        fontWeight="extrabold"
        size="2xl"
      >
        Todos
      </Heading>
      <AddTodo />
      {/* <Filters setFilter={setFilter} filter={filter} /> */}
      {/* {isUpdating ? "updating please wait..." : ""} */}
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
