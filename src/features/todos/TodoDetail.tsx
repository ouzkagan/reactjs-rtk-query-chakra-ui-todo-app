import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetTodosQuery, useUpdateTodoMutation } from "../api/apiSlice";

import {
  Box, Button,
  Center,
  Checkbox, FormControl,
  FormErrorMessage,
  HStack,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner, useDisclosure
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type Props = {
  loading: boolean;
};

type FormValues = {
  content: string;
};
export default function TodoDetail(loading: Props) {
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
      todo: !!id
        ? data?.find((todo) => parseInt(todo.id.toString()) === parseInt(id))
        : undefined,
    }),
  });
  const [newContent, setNewContent] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // react hook form
  const schema = yup.object().shape({
    content: yup
      .string()
      .min(3)
      .max(150)
      .required()
      .test("isDifferent", "You didn't change anything", (value) => {
        if (value === todo?.content) return false;
        return true;
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      content: todo?.content,
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ content }: FormValues) => {
    // updateTodo({ ...todo, content:content });

    try {
      const result = await updateTodo({ ...todo, content: content }).unwrap();
      navigate('/')
    } catch (e) {}

    // navigate('/')
  };
  // handleSubmit(({ content }) => {
  //   // document.activeElement.blur();

  //   addTodo({ content: content, isCompleted: false });
  //   if (document.activeElement instanceof HTMLElement) {
  //     document.activeElement.blur();
  //   }
  // });

  let content;
  if (loading) {
    content = (
      <Center>
        <Spinner size="lg" />
      </Center>
    );
  }
  if (todo !== undefined) {
    content = (
      <ModalContent>
        <ModalHeader>Todo Detail (id: {todo.id})</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxW="100%" p="4">
          <HStack alignItems="start">
            <Center>
            
            </Center>
            <Box    justifyContent="center" alignItems="center" h="100%">
            <Checkbox
            marginTop="10px"
              colorScheme={todo.isCompleted ? "gray" : ""}
              defaultChecked={todo.isCompleted}
              id={todo.id.toString()}
              size="lg"
              onChange={() =>
                updateTodo({ ...todo, isCompleted: !todo.isCompleted })
              }
            />
            </Box>
            <FormControl isInvalid={!!errors.content} isRequired>
              <InputGroup>
                <Input
                  placeholder="Basic usage"
                  type="text"
                  defaultValue={todo?.content}
                  // onChange={(e) => setNewContent(e.target.value)}
                  {...register("content")}
                />
              </InputGroup>
              <FormErrorMessage>
                {!!errors.content
                  ? errors?.content?.message
                  : "there are no errors"}
              </FormErrorMessage>
            </FormControl>
          </HStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            isLoading={isUpdating}
            loadingText="Updating"
            mr="4"
            onClick={handleSubmit((d) => onSubmit(d))}
          >
            Update Todo
          </Button>
          <Button colorScheme="blue" mr={3} onClick={() => navigate(`/`)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    );
  } else {
    content = (
      <ModalContent>
        <ModalHeader>Todo Detail</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxW="100%" p="4">
          {null}
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            isLoading={isUpdating}
            loadingText="Updating"
            mr="4"
            onClick={() => {
              // updateTodo({ ...todo, content: newContent || todo?.content });
              navigate(`/`);
            }}
          >
            Update Todo
          </Button>
          <Button colorScheme="blue" mr={3} onClick={() => navigate(`/`)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
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
        {content}
      </Modal>
    </>
  );
}
