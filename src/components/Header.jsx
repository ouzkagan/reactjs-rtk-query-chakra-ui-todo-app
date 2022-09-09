import {
  Avatar,
  Box,
  Button,
  Center,
  Flex, HStack, IconButton, StackDivider, Text,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";

import { Link } from "react-router-dom";

export default function Header() {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("cyan.50", "gray.600");

  
  const options = !user?.username ? {
    // not logged in
    borderRadius: "3px",
    borderColor: "gray.100",
    borderWidth: "2px",
    border: "0px",
    
  }: {
    // logged in
    // bg: bg,
    borderRadius: "3px",
    borderColor: "transparent",
  }
  return (
    <HStack
      minW="100%"
      p="4"
      divider={<StackDivider />}
      borderRadius="3px"
      mb="4"
      {...options}
    >
      <Flex w="100%" alignItems="center" justifyContent="space-between">
        {!!user?.username ? (
          <Link to="/profile">
            <Box display="flex" gap="2">
              <Avatar bg="teal.500" size="sm" src={user?.image} />
              <Center>
                <Text>Welcome {user?.username}</Text>
              </Center>
            </Box>
          </Link>
        ) : (
          <Box display="flex" gap="2"></Box>
        )}
        <Box alignSelf="flex-end">
          {!!user.username && (
            <Link to="/profile">
              <IconButton borderRadius="3px" size="lg" icon={<FiUser />} />
              {/* <Button
            borderRadius="3px"
            size="lg"
            leftIcon={<FiUser />} 
          >
            Profile
          </Button> */}
            </Link>
          )}
          <IconButton
            borderRadius="3px"
            size="lg"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            ml="2"
          />
          {/* <IconButton
          borderRadius="3px"
          size="lg"
          icon={<MdOutlineLogout />}
          ml="2"
          onClick={() => dispatch(logout())}
        /> */}
          {!!user.username && (
            <Link to="/">
              <Button
                borderRadius="3px"
                size="lg"
                leftIcon={<MdOutlineLogout />}
                onClick={() => dispatch(logout())}
                ml="2"
              >
                Logout
              </Button>
            </Link>
          )}
        </Box>
      </Flex>
    </HStack>
  );
}
