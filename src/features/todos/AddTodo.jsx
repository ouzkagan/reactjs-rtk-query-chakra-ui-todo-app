import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  InputGroup
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAddTodoMutation } from "../api/apiSlice";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function AddTodo() {
  const [newTodo, setNewTodo] = useState("");

  const [addTodo, { isLoading, isSuccess, isError }] = useAddTodoMutation();

  const schema = yup.object().shape({
    content: yup.string().min(3).max(150).required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(({ content }) => {
    addTodo({ userId: 1, content: content, isCompleted: false });
  });
  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isLoading, isSuccess, isError]);

  return (
    //   <form onSubmit={handleSubmit}>
    //   <label htmlFor="new-todo">Enter a new todo item</label>
    //   <div className="new-todo">
    //     <input
    //       type="text"
    //       id="new-todo"
    //       value={newTodo}
    //       onChange={(e) => setNewTodo(e.target.value)}
    //       placeholder="Enter new todo"
    //     />
    //   </div>

    //   <button className="submit">submit todo {isAdding ? "(Adding your new todo...)" : ""}</button>
    // </form>

    <form onSubmit={onSubmit}>
      <HStack m="8">
        {/* <Input 
      variant='filled' 
      id="new-todo"
      value={newTodo}
      onChange={(e) => setNewTodo(e.target.value)}
      placeholder="Enter new todo"
      borderColor='gray.200'
      /> */}
        <FormControl isInvalid={!!errors.content} isRequired>
          <InputGroup>
            {/* <InputLeftElement
              pointerEvents="none"
              children={<CFaUserAlt color="gray.300" />}
            /> */}
            <Input
              type="text"
              placeholder="Buy milk.."
              name="content"
              // ref={register}
              {...register("content")}
              // defaultValue={user?.content}
            />
          </InputGroup>
          <FormErrorMessage>
            {!!errors.content
              ? errors?.content?.message
              : "there are no errors"}
          </FormErrorMessage>
        </FormControl>
        <Button type="submit" colorScheme="orange" px="8">
          Add Todo
        </Button>
      </HStack>
    </form>
  );
}
