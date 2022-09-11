import {
  Avatar,
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Control, useForm, useWatch } from "react-hook-form";
import { FaUserAlt } from "react-icons/fa";
import { FiFile } from "react-icons/fi";
import * as yup from "yup";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FileUpload from "../../components/FileUpload";
import { login, useIsAuthenticated, useUser } from "./userSlice";
const CFaUserAlt = chakra(FaUserAlt);

type FormValues = {
  username: string;
  file_: string;
};

export default function userLogin() {
  // redux
  const { user } = useUser();

  const dispatch = useDispatch();
  const isAuthenticated = useIsAuthenticated()
  // router
  const navigate = useNavigate();
  // Form
  const [preview, setPreview] = useState(undefined);
  const schema = yup.object().shape({
    username: yup.string().min(3).max(20).required().matches(
      /^[a-zA-Z]+$/,
      "This field cannot contain white special character"
    ),
    // password: yup.string().min(8).required(),
    file_: yup
      .mixed()
      .required("You need to provide a file")
      // .test('isPhotoExists', '', ()=>{
      //   return user?.user?.image
      // })
      .test("filePresence", "Please add avatar", (value) => {
        if (user?.image) return true;
        if (value.length == 0) return false; // attachment is optional
        return true;
      })
      .test("fileSize", "The file is too large", (value) => {
        if (user?.image) return true;
        return value && value?.[0]?.size <= 2000000;
      }),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  // const fileChange = watch("file_")
  // const fileChange = useWatch({ name: "file_", control });

  function fileChange({ control }: { control: Control<FormValues> }) {
    const file = useWatch({
      control,
      name: "file_", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
      defaultValue: "default" // default value before the render
    });
  
    return file
  }
  const onSubmit = handleSubmit((data) => {
    // console.log("On Submit: ", { ...data, preview });
    dispatch(
      login({
        username: data.username,
        image: preview || user?.image,
        imageFile: JSON.stringify(data.file_),
      })
    );
    navigate("/todos");
  });

  const getBase64 = (file:Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  // Watch image upload.
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const { file_ } = value;
      if (name != "file_") {
        return;
      }
      //@ts-ignore:
      if (!!value && !!value[0]) {
        setPreview(undefined);
        return;
      }

      //@ts-ignore:
      if (file_?.length == 0) {
        setPreview(undefined);
        return;
      }

      // store base64 in local storage
      //@ts-ignore:
      getBase64(file_[0]).then((base64) => {
        // console.log("file stored",base64);
      //@ts-ignore:
        setPreview(base64);
      });

      // const objectUrl = URL.createObjectURL(file_[0]);
      // setPreview(objectUrl);
    });
    return () => subscription.unsubscribe();
  }, [fileChange]);

  // color mode
  const bg = useColorModeValue("cyan.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");


  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="75vh"
      // backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
      color={textColor}
      w="100%"
      maxW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
      minW={{ base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" }}
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
        backgroundColor={bg}
        boxShadow="lg"
        p={10}
        borderRadius={3}
        // borderRadius="3px"
        border="1px"
        borderColor="whiteAlpha.300"
      >
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={onSubmit}>
            <Heading size="lg" color={textColor} mb={3}>
              Profile {user?.username && "of " + user?.username}
            </Heading>
            <Stack spacing={4} p="1rem">
              <FormControl isInvalid={!!errors.file_} isRequired>
                {/* <FormLabel>{"Chose your avatar:"}</FormLabel> */}

                {/* <FileUpload
                  accept={"image/*"}
                  // register={register('file_', { validate: validateFiles })}
                  register={register}
                >
                  <Button leftIcon={<Icon as={FiFile} />}>Upload</Button>
                </FileUpload> */}

                <FileUpload
                  accept={"image/*"}
                  multiple={false}
                  register={register("file_")}
                >
                  <Flex
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    gap={4}
                  >
                    <Avatar
                      bg="teal.500"
                      size="2xl"
                      src={preview || user?.image}
                    />
                    <Button leftIcon={<Icon as={FiFile} />}>
                      Upload Avatar
                    </Button>
                  </Flex>
                </FileUpload>

                <FormErrorMessage>
                  {errors.file_ && errors?.file_.message}
                </FormErrorMessage>
              </FormControl>
              {/* <Input
                placeholder="Select Date and Time"
                size="md"
                type="file"
                accept="image/*"
              /> */}
              <FormControl isInvalid={!!errors.username} isRequired>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="JohnDoe"
                    // name="username"
                    // ref={register}
                    {...register("username")}
                    defaultValue={user?.username}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {!!errors.username
                    ? errors?.username?.message
                    : "there are no errors"}
                </FormErrorMessage>
              </FormControl>
              <Button
                borderRadius="5px"
                type="submit"
                // variant="solid"
                // colorScheme="teal"
                width="full"
              >
                {user?.username && !!user?.image ? "Save" : "Login"}
              </Button>
              {isAuthenticated && (
                <Text>
                  You are already logged in go to{" "}
                  <button onClick={() => navigate("/todos")}>Todos</button>
                  {/* <button onClick={()=>dispatch(logout())}>Logout</button> */}
                </Text>
              )}
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
