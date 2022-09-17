import { createRoot } from "react-dom/client";
import App from "./App";
import store, { persistor } from "./app/store";
import "./index.css";

import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ChakraProvider>
              <App />
            </ChakraProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>
  );
}
