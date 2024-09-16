import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../components/Dashboard";
import NotFound from "../app/not-found";
import { useRouter } from "next/navigation";
import TodoItem from "../components/TodoItem";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  notFound: () => <NotFound />,
}));

global.fetch = jest.fn((route, { method }) => {
  switch (method) {
    case "GET":
      return Promise.reject({
        json: () => ({ error: "raised from testcase GET API" }),
      });

    case "POST":
      return Promise.reject({
        json: () => ({
          error: "raised from testcase POST API",
          success: false,
        }),
      });

    default:
      break;
  }
});

const getErrorMsg = () => {
  return waitFor(
    () => {
      return screen.getByText("Go back to dashboard");
    },
    { timeout: 4000 }
  );
};

describe("Error Scenario test cases for dashboard component", () => {
  it("ensure dashboard redirect to not found if GET api fails", async () => {
    render(<Dashboard />);
    const errorMsg = await getErrorMsg();
    await expect(errorMsg).toBeInTheDocument();
  }, 5000);

  it("create new todo and ensure redirected to not found page", async () => {
    let apiFn = jest.fn();

    useRouter.mockImplementation(() => ({
      pathName: "/",
      push: apiFn,
    }));

    const { container } = render(<Dashboard />);
    const button = await waitFor(
      () => {
        return screen.getByTestId("addBtn", { within: container });
      },
      { timeout: 4000 }
    );

    fireEvent.click(button);

    await expect(await getErrorMsg()).toBeInTheDocument();
  });
});

describe("Error Scenario test cases for Todo Items component", () => {
  it("ensure redirect to not found while error occured for creating todo item", async () => {
    let apiFn = jest.fn();

    useRouter.mockImplementation(() => ({
      pathName: "/",
      push: apiFn,
    }));

    const { container } = render(<TodoItem params={{ id: 1 }} />);

    const textField = screen.getByRole("textbox", {
      name: "list item",
      within: container,
    });

    fireEvent.change(textField, { target: { value: "item - 001" } });

    const keyPressed = fireEvent.keyDown(textField, {
      key: "Enter",
      charCode: 13,
    });

    await expect(keyPressed).toBeTruthy();
    await expect(await getErrorMsg()).toBeInTheDocument();
  });
});
