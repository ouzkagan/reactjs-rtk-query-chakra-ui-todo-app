import { createRoot } from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import store, { persistor } from "./app/store";
import "./index.css";

import { Provider } from "react-redux";

import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./features/api/apiSlice";

import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    <ApiProvider api={apiSlice}>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ChakraProvider>
              <App />
            </ChakraProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </ApiProvider>
  );
}
