import "@testing-library/jest-dom";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { TodoContext } from "../app/contextProvider";
import NewPage from "../app/new/[id]/page";
import { useRouter } from "next/navigation";
import NotFound from "../app/not-found";
import { act } from "react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  notFound: () => <NotFound />,
}));

global.fetch = jest.fn((route, { method }) => {
  switch (method) {
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
  const setTodoName = jest.fn();
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

describe("Testcases for Todo(New page) Component", () => {
  const todoId = 1;
  const todoName = "untitled";

  it("update todo name by pressing enter key and ensure it is updated", async () => {
    let apiFn = jest.fn(() => {
      title: "updated value";
    });

    useRouter.mockImplementation(() => ({
      pathName: `/api/todo/${1}`,
      push: apiFn,
    }));

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

    await expect(buttons).toBeInTheDocument();

    const enterKeyPressed = await waitFor(() => {
      return fireEvent.keyDown(textField, { key: "Enter", charCode: 13 });
    });

    await expect(enterKeyPressed).toBeTruthy();

    const textFieldUpdated = screen.getByRole("textbox", {
      name: "Name",
      within: container,
    });

    await expect(textFieldUpdated.value).toBe("updated value");
  }, 10000);

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
