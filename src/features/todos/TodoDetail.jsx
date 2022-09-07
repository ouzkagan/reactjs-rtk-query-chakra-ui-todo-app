import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useGetTodosQuery,
  useUpdateTodoMutation
} from "../api/apiSlice";

import {
  Button, Checkbox,
  HStack, Input, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure
} from "@chakra-ui/react";

export default function TodoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();

  // Previous approach replaced with selectFromResult
  //const {
  //   data: singleTodo,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error,
  //   isFetching
  // } = useGetTodoQuery(id);

  // let content;

  // if (isFetching) {
  //   content = <div>Loading...</div>
  // } else if (isSuccess) {
  //   content = <div>
  //     {isFetching ? <div>Todo is loading!!</div> :
  //       JSON.stringify(singleTodo)
  //     }
  //   </div>
  // } else if (isError) {
  //   content = <div>{error.toString()}</div>
  // }

  //We can just take data from existing query. There is no need to fetch individual todo again.
  const { todo } = useGetTodosQuery(undefined, {
    selectFromResult: ({ data }) => ({
      todo: data?.find((todo) => todo.id === id),
    }),
  });
  const [newContent, setNewContent] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  let content;
  if (!!todo) {
    content = (
      <HStack>
          <Checkbox
            colorScheme={todo.isCompleted ? "gray" : ""}
            defaultChecked={todo.isCompleted}
            id={todo.id}
            onChange={() =>
              updateTodo({ ...todo, isCompleted: !todo.isCompleted })
            }
          />
        
        <Input
          placeholder="Basic usage"
          type="text"
          value={newContent || todo.content}
          onChange={(e) => setNewContent(e.target.value)}
        />
      </HStack>
    );
  }

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal
        isOpen={true}
        onClose={() => navigate(`/`)}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxW="100%" p="4">
            {content}
          </ModalBody>

          <ModalFooter>
            <Button
              variant='outline'
              isLoading={isUpdating}
              loadingText='Updating'
              mr="4"
              onClick={() =>
                {updateTodo({ ...todo, content: newContent || todo.content })
                navigate(`/todos`)}
              }
            >
              Update Todo
            </Button>
            <Button colorScheme="blue" mr={3} onClick={() => navigate(`/todos`)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    // <div className="popup">
    //   <div>TodoDetail</div>
    //   {content}
    //   <button
    //     onClick={() =>
    //       updateTodo({ ...todo, content: newContent || todo.content })
    //     }
    //   >
    //     update
    //   </button>
    //   <button onClick={() => navigate(`/`)}>close</button>

    // </div>
  );
}
