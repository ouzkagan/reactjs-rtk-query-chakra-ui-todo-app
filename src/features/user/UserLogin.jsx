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
  Stack, Text, useColorModeValue
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import { FaLock, FaUserAlt } from "react-icons/fa";
import { FiFile } from "react-icons/fi";
import * as yup from "yup";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FileUpload from "../../components/FileUpload";
import { login } from "./userSlice";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export default function userLogin() {
  // redux
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // router
  const navigate = useNavigate()
  // Form
  const [preview, setPreview] = useState(undefined);
  const schema = yup.object().shape({
    username: yup.string().min(3).max(20).required(),
    // password: yup.string().min(8).required(),
    file_: yup
      .mixed()
      .required("You need to provide a file")
      .test("filePresence", "Please add avatar", (value) => {
        if (value.length == 0) return false; // attachment is optional
        return true;
      })
      .test("fileSize", "The file is too large", (value) => {
        return value && value?.[0]?.size <= 2000000;
      }),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  // console.log(); // watch input value by passing the name of it
  // const fileChange = watch("file_")
  const fileChange = useWatch({ name: "file_", control });
  // const uploader = (file) => {

  //   const objectUrl = URL.createObjectURL(selectedFile)

  //   const reader = new FileReader();
  //   reader.addEventListener('load', ()=>{
  //       // localStorage.setItem('recent-image',reader.result)
  //       console.log(reader.result)
  //   })
  //   reader.readAsDataURL(file);
  // }
  const onSubmit = handleSubmit((data) => {
    // console.log("On Submit: ", { ...data, preview });
    dispatch(login({username: data.username, image: preview, imageFile: JSON.stringify(data.file_)}));
    navigate('/todos')
  });

  // Watch image upload.
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const { file_ } = value;
      if (name != "file_") {
        return;
      }
      if (!!value[0]) {
        setPreview(undefined);
        return;
      }
      if (file_.length == 0) {
        setPreview(undefined);
        return;
      }
      const objectUrl = URL.createObjectURL(file_[0]);
      setPreview(objectUrl);
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
              Profile {user?.user?.username && 'of ' + user?.user?.username}
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
                  // multiple
                  register={register("file_")}
                >
                  <Flex
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    gap={4}
                  >
                    <Avatar bg="teal.500" size="2xl" src={preview || user?.user?.image} />
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
                    name="username"
                    // ref={register}
                    {...register("username")}
                    defaultValue={user.user?.username}
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
                {user.user?.username && !!user.user?.image ? 'Save' : 'Login'}
              </Button>
              {!!user.user?.username &&
                <Text>
                  You are already logged in go to <button onClick={()=>navigate('/todos')}>Todos</button>
                  {/* <button onClick={()=>dispatch(logout())}>Logout</button> */}
                </Text>
              }
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
