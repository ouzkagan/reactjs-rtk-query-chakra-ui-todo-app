import App from "../../../App";
import {
  getStateWithUser,
  renderWithProviders
} from "../../../utils/test-utils";

import { screen } from "@testing-library/react";
import { rest } from "msw";
import { server } from "../../../mock/api/server";
const apiData = [
  { content: "Mark Zuckerberg", id: 34, isCompleted: true },
  { content: "Elon Musk", id: 44, isCompleted: true },
];

test("Route should be protected if not logged in", async () => {
  renderWithProviders(<App />);

  // const allRows = await screen.findAllByRole("row");

  expect(screen.getByRole("app")).toBeInTheDocument();
  expect(screen.getByRole("protected")).toBeInTheDocument();
});

test("logged in user can fetch todos", () => {
  // custom msw server
  server.use(
    rest.get(`https://631347b3b466aa9b03965cfe.mockapi.io/todos`, (req, res, ctx) => {
      return res(ctx.json(apiData));
    })
  );

  renderWithProviders(<App />
  , {
    preloadedState: getStateWithUser(),
  }
  );

  // const allRows = await screen.findAllByRole("row");

  expect(screen.getByRole("todolist-container")).toBeInTheDocument();
  // await waitFor(() => {
});
