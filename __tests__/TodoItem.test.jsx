import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import NewPage from "../app/new/[id]/page";
import TodoItem from "../components/TodoItem";
import TodoFormController from "../components/TodoItem/TodoFormController";
import React from "react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

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
  afterEach(() => {
    jest.restoreAllMocks();
    useRouter.mockRestore();
  });

  let todoId = "1";

  const fakeTodoItem = {
    id: 1,
    todo_item: "item - 001",
    is_checked: false,
    success: true,
  };

  it("render todo page newly created", () => {
    const mockLoadData = {
      title: "untitled",
      id: 1,
      createdAt: "09-09-2024 15:15:15TZ",
    };

    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({ data: mockLoadData, success: true }),
      });
    });

    render(<NewPage params={{ id: todoId }} />);
    const label = screen.getByLabelText("Name");
    waitFor(() => expect(label.value).toBe("untitled"));
  });

  it("ensure items listed in todo page", async () => {
    const mockData = [
      { todo_item: "item - 001", is_checked: false, id: 1, is_deleted: false },
    ];

    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({ rows: mockData, message: "success", success: true }),
      });
    });

    useRouter.mockImplementation(() => ({
      pathName: `/api/todo/${todoId}/todo-item`,
      push: jest.fn(),
    }));

    const { container } = render(<TodoItem params={{ id: todoId }} />);

    const items = await waitFor(
      () => {
        return screen.getByTestId(`todo-items-list-${mockData[0].id}`, {
          within: container,
        });
      },
      { timeout: 6000 }
    );
    await expect(items).toBeInTheDocument();
  }, 10000);

  it("create a new todo item", async () => {
    const itemName = "item - 001";
    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({
          id: 1,
          todoItem: "item - 001",
          isChecked: false,
          success: true,
        }),
      });
    });

    let apiFn = jest.fn(() => {
      itemName: itemName;
    });

    useRouter.mockImplementation(() => ({
      pathName: `/api/todo/${todoId}/todo-item`,
      push: apiFn,
    }));

    const { container } = render(<TodoItem params={{ id: todoId }} />);
    const textField = screen.getByRole("textbox", {
      name: "list item",
      within: container,
    });
    fireEvent.change(textField, { target: { value: itemName } });

    const keyPressed = fireEvent.keyDown(textField, {
      key: "Enter",
      charCode: 13,
    });

    await expect(keyPressed).toBeTruthy();
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
    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({ message: "success", success: true }),
      });
    });

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

    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({ message: "success", success: true }),
      });
    });

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
    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({ success: true }),
      });
    });
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
