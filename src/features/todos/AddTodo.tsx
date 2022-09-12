import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  InputGroup
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useAddTodoMutation } from "../api/apiSlice";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormValues = {
  content: string;
};
const AddTodo = (): JSX.Element => {
  const controlReference = useRef(null);

  const [addTodo, { isLoading, isSuccess, isError }] = useAddTodoMutation();

  const schema = yup.object().shape({
    content: yup.string().min(3).max(150).required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(({ content }) => {
    // document.activeElement.blur();

    addTodo({ content: content, isCompleted: false });
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isLoading, isSuccess, isError]);

  return (
    <form onSubmit={onSubmit}>
      <HStack m="8" alignItems="start">
        <FormControl isInvalid={!!errors.content} isRequired>
          <InputGroup>
            <Input
              type="text"
              placeholder="Buy milk.."
              // name="content"
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
        <Button
          type="submit"
          colorScheme="orange"
          px="8"
          ref={controlReference}
        >
          Add Todo
        </Button>
      </HStack>
    </form>
  );
};
export default AddTodo;
