import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import NewPage from "../app/new/[id]/page";
import TodoItem from "../components/TodoItem";
import TodoFormController from "../components/TodoItem/TodoFormController";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn((route, { method }) => {
  let fakeResp;
  switch (method) {
    case "GET":
      fakeResp = {
        title: "untitled",
        id: 1,
        createdAt: "09-09-2024 15:15:15TZ",
      };

      return Promise.resolve({
        json: () => ({ data: fakeResp, success: true }),
      });

    case "POST":
      fakeResp = {
        id: 1,
        todoItem: "item - 001",
        isChecked: false,
        success: true,
      };

      return Promise.resolve({
        json: () => fakeResp,
      });

    case "PUT":
      return Promise.resolve({
        json: () => ({ message: "success", success: true }),
      });

    case "DELETE":
      return Promise.resolve({
        json: () => ({ success: true }),
      });

    default:
      break;
  }
});

const renderTodoItems = (fakeTodoItem, todoId) => {
  const setTodoItems = jest
    .fn()
    .mockImplementation((prevItems) => [...prevItems, fakeTodoItem]);

  return render(
    <TodoFormController
      item={fakeTodoItem}
      todoId={todoId}
      setTodoItems={setTodoItems}
      setError={jest.fn()}
      setListItemLoading={jest.fn()}
    />
  );
};

const renderTodoItemsAndReturnTextField = async (fakeTodoItem, todoId) => {
  renderTodoItems(fakeTodoItem, todoId);
  const element = await waitFor(() => {
    return screen.getByTestId(`todoItem-${fakeTodoItem.id}`);
  });

  return screen
    .getAllByRole("textbox", {
      within: element,
    })
    .filter((data) => data.id === `standard-basic todoItem-${fakeTodoItem.id}`);
};

describe("Testcases for Todo Items Component", () => {
  let todoId = "1";

  const fakeTodoItem = {
    id: 1,
    todo_item: "item - 001",
    is_checked: false,
    success: true,
  };

  it("render todo page newly created", () => {
    render(<NewPage params={{ id: todoId }} />);
    const label = screen.getByLabelText("Name");
    waitFor(() => expect(label.value).toBe("untitled"));
  });

  it("create a new todo item", async () => {
    let apiFn = jest.fn();

    useRouter.mockImplementation(() => ({
      pathName: `/new/${todoId}`,
      push: apiFn,
    }));

    render(<TodoItem params={{ id: todoId }} />);
    const textField = await waitFor(
      () => {
        return screen.getByRole("textbox", { name: "list item" });
      },
      { timeout: 10000 }
    );

    await waitFor(
      () => {
        fireEvent.keyDown(textField, { key: "Enter", charCode: 13 });
      },
      { timeout: 10000 }
    );

    await waitFor(() => expect(textField.value).toBe(""));
  }, 20000);

  it("ensure created item are displaying in the page", async () => {
    const textField = await renderTodoItemsAndReturnTextField(
      fakeTodoItem,
      todoId
    );

    expect(textField[0]).not.toBeNull();
    expect(textField[0]).toBeInTheDocument();
    expect(textField[0].value).toBe(fakeTodoItem.todo_item);
  });

  it("ensure error while creating todo item with empty value", async () => {
    const { container } = render(<TodoItem params={{ id: todoId }} />);
    const textField = await waitFor(
      () => {
        return screen.getByRole("textbox", { name: "list item" });
      },
      { timeout: 7000 }
    );

    fireEvent.keyDown(textField, { key: "Enter", charCode: 13 });

    const errorText = await waitFor(
      () => {
        return screen.getByText("item cannot be null", { within: container });
      },
      { timeout: 6000 }
    );

    await expect(errorText).toBeInTheDocument();
  }, 10000);

  it("update an existing todo item", async () => {
    const textField = await renderTodoItemsAndReturnTextField(
      fakeTodoItem,
      todoId
    );

    expect(textField[0]).not.toBeNull();
    fireEvent.change(textField[0], { target: { value: "item updated - 001" } });
    fireEvent.keyDown(textField[0], { key: "Enter", charCode: 13 });

    await waitFor(
      () => {
        expect(textField[0].value).toBe("item updated - 001");
      },
      { timeout: 7000 }
    );
  }, 10000);

  it("update todo item by toggle checkbox from the list", async () => {
    fakeTodoItem.is_checked = true;
    renderTodoItems(fakeTodoItem, todoId);

    const element = await waitFor(() => {
      return screen.getByTestId(`todoItem-${fakeTodoItem.id}`);
    });

    const checkbox = screen
      .getAllByRole("checkbox", { within: element })
      .filter((data) => data.id === `todoItem-${fakeTodoItem.id}-checkbox`);

    expect(checkbox[0]).not.toBeNull();

    fireEvent.click(checkbox[0]);

    await waitFor(
      () => {
        expect(checkbox[0]).toBeChecked();
      },
      { timeout: 7000 }
    );
  }, 10000);

  it("delete todo item from the list", async () => {
    renderTodoItems(fakeTodoItem, todoId);

    const element = await waitFor(() => {
      return screen.getByTestId(`todoItem-${fakeTodoItem.id}`);
    });

    const deleteBtn = screen.getAllByRole("button", { within: element });

    expect(deleteBtn[0]).not.toBeNull();

    fireEvent.click(deleteBtn[0]);

    const deleted = screen.queryAllByText("item updated - 001");

    await waitFor(
      () => {
        expect(deleted[0]).toBeUndefined();
      },
      { timeout: 7000 }
    );
  }, 10000);
});
