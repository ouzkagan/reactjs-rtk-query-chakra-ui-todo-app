// ProtectedRoute.js
import { Box, Button, StackDivider, VStack } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../features/user/userSlice";
const ProtectedRoute = () => {
  // check auth
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate()
  // show unauthorized screen if no user is found in redux store

  if (!isAuthenticated) {
    return (
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
        <Box textAlign="center" p="10">
          You must be logged in to see this content{" "}
          <Button ml="4" onClick={() => navigate("/profile")}>
            Login
          </Button>
        </Box>
      </VStack>
    );
  }
  // returns child route elements
  else return <Outlet />;
};
export default ProtectedRoute;

