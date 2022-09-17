import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithProviders } from "./utils/test-utils";
const apiData = [
  { content: "todo 1", id: 34, isCompleted: true },
  { content: "todo 2", id: 44, isCompleted: true },
];

describe("<App />", () => {
  it("smoke test", () => {
    renderWithProviders(<App />);
  });

  it('handles not logged in', async () => {
    renderWithProviders(<App />)

    // screen.getByText('Loading...')

    // await screen.findByRole('h2', { name: /Todos/i })
    
    // expect(screen.findByRole("heading")).toHaveTextContent(/Todos/);

    expect(screen.getByRole("app")).toBeInTheDocument();
    expect(screen.getByRole("protected")).toBeInTheDocument();

  })
});
