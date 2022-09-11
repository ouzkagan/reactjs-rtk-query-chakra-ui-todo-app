import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  InputGroup
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useAddTodoMutation } from "../api/apiSlice";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const AddTodo = (): JSX.Element => {
  type FormValues = {
    content: string;
  };

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
    addTodo({ content: content, isCompleted: false });
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
        <Button type="submit" colorScheme="orange" px="8">
          Add Todo
        </Button>
      </HStack>
    </form>
  );
};
export default AddTodo