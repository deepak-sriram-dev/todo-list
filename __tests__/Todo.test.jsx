import "@testing-library/jest-dom";
import {
  screen,
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { TodoContext } from "../app/contextProvider";
import NewPage from "../app/new/[id]/page";
import NotFound from "../app/not-found";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  notFound: () => <NotFound />,
}));

global.fetch = jest.fn((route, { method }) => {
  switch (method) {
    case "GET":
      return Promise.resolve({
        json: () => ({
          data: {
            id: 1,
            title: "untitled",
            created_at: "2024-09-16 00:00:00Z",
          },
          success: true,
        }),
      });

    case "PUT":
      return Promise.resolve({
        json: () => ({
          message: "success",
          success: true,
          id: 1,
          title: "updated value",
        }),
      });

    default:
      break;
  }
});

const renderComponentAndReturnTextField = (todoName, todoId) => {
  const setTodoName = jest.fn(() => {
    title: "updated value";
  });
  const { container } = render(
    <TodoContext.Provider value={{ todoName, setTodoName }}>
      <NewPage params={{ id: todoId }} />
    </TodoContext.Provider>
  );

  const textField = screen.getByRole("textbox", {
    name: "Name",
    within: container,
  });

  return { container, textField };
};

const renderComponentForUpdate = (todoName, todoId) => {
  const { container, textField } = renderComponentAndReturnTextField(
    todoName,
    todoId
  );

  fireEvent.change(textField, {
    target: { value: "updated value" },
  });

  const buttons = screen.getByTestId("save-delete-icons-todo", {
    within: container,
  });

  return { container, textField, buttons };
};

describe("Testcases for Todo(New page) Component", () => {
  const todoId = 1;
  let todoName = "untitled";

  it("ensure todo page rendered", async () => {
    const { container, textField } = renderComponentAndReturnTextField(
      todoName,
      todoId
    );

    await expect(textField).toBeInTheDocument();
    await expect(textField.value).toBe("untitled");
  });

  it("update todo name by pressing enter key", async () => {
    const setTodoName = jest.fn(() => {
      title: "updated value";
    });

    const { container } = render(
      <TodoContext.Provider value={{ todoName, setTodoName }}>
        <NewPage params={{ id: todoId }} />
      </TodoContext.Provider>
    );

    const textField = screen.getByRole("textbox", {
      name: "Name",
      within: container,
    });

    fireEvent.change(textField, { target: { value: "updated value" } });

    const buttons = screen.getByTestId("save-delete-icons-todo", {
      within: container,
    });
    await expect(buttons).toBeInTheDocument();
    fireEvent.keyDown(textField, { key: "Enter", charCode: 13 });

    const textFieldUpdated = screen.getByRole("textbox", {
      name: "Name",
      within: container,
    });
    await expect(textFieldUpdated.value).toBe("updated value");
  });

  it("update todo name by clicking on Done Icon and ensure it is updated ", async () => {
    const { container, textField, buttons } = renderComponentForUpdate(
      todoName,
      todoId
    );

    await expect(buttons).toBeInTheDocument();
    const doneIcon = screen.getByTestId("DoneIcon", { within: buttons });
    fireEvent.click(doneIcon);

    const textFieldUpdated = screen.getByRole("textbox", {
      name: "Name",
      within: container,
    });

    await expect(textFieldUpdated.value).toBe("updated value");
  });

  it("ensure error while updating todo with empty value by clicking on Done Icon", async () => {
    const { container, textField } = renderComponentAndReturnTextField(
      todoName,
      todoId
    );

    fireEvent.change(textField, { target: { value: "" } });

    const buttons = screen.getByTestId("save-delete-icons-todo", {
      within: container,
    });

    await expect(buttons).toBeInTheDocument();

    const doneIcon = screen.getByTestId("DoneIcon", { within: buttons });
    fireEvent.click(doneIcon);

    const getErrorMsg = screen.getByText("todo name can't be null", {
      within: buttons,
    });

    await expect(getErrorMsg).toBeInTheDocument();
  });

  it("ensure error while updating todo with empty value by pressing enter key", async () => {
    const { container, textField } = renderComponentAndReturnTextField(
      todoName,
      todoId
    );

    fireEvent.change(textField, { target: { value: "" } });

    const enterKeyPressed = await waitFor(() => {
      return fireEvent.keyDown(textField, { key: "Enter", charCode: 13 });
    });

    const errorMsg = screen.getByText("todo name can't be null", {
      within: container,
    });

    await expect(enterKeyPressed).toBeTruthy();
    await expect(errorMsg).toBeInTheDocument();
  });

  it("ensure todo name not updated when clicking on Close Icon", async () => {
    const { container, textField } = renderComponentAndReturnTextField(
      todoName,
      todoId
    );

    fireEvent.change(textField, { target: { value: "updated value" } });

    const buttons = screen.getByTestId("save-delete-icons-todo", {
      within: container,
    });

    await expect(buttons).toBeInTheDocument();

    const closeIcon = screen.getByTestId("CloseIcon", { within: buttons });
    fireEvent.click(closeIcon);

    const textFieldUpdated = screen.getByRole("textbox", { name: "Name" });
    expect(textFieldUpdated.value).toBe("untitled");
  });
});
