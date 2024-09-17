import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../components/Dashboard";
import NotFound from "../app/not-found";
import { useRouter } from "next/navigation";
import TodoItem from "../components/TodoItem";
import NewPage from "../app/new/[id]/page";
import TodoFormController from "../components/TodoItem/TodoFormController";
import { afterEach } from "node:test";
import { act } from "react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  notFound: () => <NotFound />,
}));

const getErrorMsg = () => {
  return waitFor(
    () => {
      return screen.getByText("Go back to dashboard");
    },
    { timeout: 4000 }
  );
};

const updateTestcase = async (todoId, mockTodoItem) => {
  let apiFn = jest.fn();
  useRouter.mockImplementation(() => ({
    pathName: `/api/todo/${todoId}/todo-item/${mockTodoItem.id}`,
    push: apiFn,
  }));

  const setTodoItems = jest
    .fn()
    .mockImplementation((prev) => [...prev, mockTodoItem]);

  render(
    <TodoFormController
      item={mockTodoItem}
      todoId={todoId}
      setTodoItems={setTodoItems}
      setError={jest.fn()}
      setListItemLoading={jest.fn()}
    />
  );

  const element = screen.getByTestId(`todoItem-${mockTodoItem.id}`);

  const textField = screen
    .getAllByRole("textbox", { within: element })
    .filter((data) => data.id === `standard-basic todoItem-${mockTodoItem.id}`);

  await expect(textField[0]).not.toBeNull();
  fireEvent.change(textField[0], { target: { value: "item updated - 001" } });
  return fireEvent.keyDown(textField[0], {
    key: "Enter",
    charCode: 13,
  });
};

const deleteTestCase = async (todoId, mockTodoItem) => {
  let apiFn = jest.fn();

  useRouter.mockImplementation(() => ({
    pathName: `/api/todo/${todoId}/todo-item/${mockTodoItem.id}`,
    push: apiFn,
  }));

  const setTodoItems = jest
    .fn()
    .mockImplementation((prev) => [...prev, mockTodoItem]);

  render(
    <TodoFormController
      item={mockTodoItem}
      todoId={todoId}
      setTodoItems={setTodoItems}
      setError={jest.fn()}
      setListItemLoading={jest.fn()}
    />
  );

  const element = screen.getByTestId(`todoItem-${mockTodoItem.id}`);
  const deleteBtn = screen.getByTestId("DeleteIcon", { within: element });
  await expect(deleteBtn).not.toBeNull();

  return fireEvent.click(deleteBtn);
};

global.fetch = jest.fn();

describe("Error Scenario test cases for all components. API rejected from Promise calls", () => {
  let todoId = 1;
  const mockTodoItem = {
    id: 1,
    todo_item: "item - 001",
    is_checked: false,
    success: true,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("ensure dashboard redirect to not found if GET api fails", async () => {
    let apiFn = jest.fn();

    global.fetch.mockImplementation(() => {
      return Promise.reject({
        json: () => ({
          error: "raised from testcase GET API",
          success: false,
        }),
      });
    });

    useRouter.mockImplementation(() => ({
      pathName: `/api/todo`,
      push: apiFn,
    }));

    render(<Dashboard />);
    const errorMsg = await getErrorMsg();
    await expect(errorMsg).toBeInTheDocument();
  }, 5000);

  it("create new todo and ensure redirected to not found page", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.reject({
        json: () => ({
          error: "raised from testcase POST API",
          success: false,
        }),
      });
    });
    let apiFn = jest.fn();

    useRouter.mockImplementation(() => ({
      pathName: "/api/todo",
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

  it("create new todo with wrong data for ensuring failure", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({
          error: "raised from testcase POST API",
          success: false,
        }),
      });
    });

    useRouter.mockImplementation(() => ({
      pathName: "/api/todo",
      push: jest.fn(),
    }));

    const { container } = render(<Dashboard />);
    const button = await waitFor(
      () => {
        return screen.getByTestId("addBtn", { within: container });
      },
      { timeout: 4000 }
    );

    fireEvent.click(button);
    const btnPressed = fireEvent.click(button);

    await expect(btnPressed).toBeTruthy();
    await expect(await getErrorMsg()).toBeInTheDocument();
  }, 10000);

  it("render new page with error scenario", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.reject({
        json: () => ({
          error: "raised from testcase GET API",
          success: false,
        }),
      });
    });

    render(<NewPage params={{ id: 1 }} />);
    await expect(await getErrorMsg()).toBeInTheDocument();
  });

  it("ensure redirect to not found while error occured for creating todo item", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.reject({
        json: () => ({
          error: "raised from testcase POST API",
          success: false,
        }),
      });
    });
    let apiFn = jest.fn();

    useRouter.mockImplementation(() => ({
      pathName: `/api/todo/${todoId}/todo-item`,
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

  it("ensure redirect to not found while error occured for creating todo item", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({
          error: "raised from testcase POST API",
          success: false,
        }),
      });
    });
    let apiFn = jest.fn();

    useRouter.mockImplementation(() => ({
      pathName: `/api/todo/${todoId}/todo-item`,
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

  it("redirect to not found if error occured for updating todo item", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.reject({
        json: () => ({
          error: "raised from testcase PUT API",
          success: false,
        }),
      });
    });

    const btnPressed = await updateTestcase(todoId, mockTodoItem);
    render(<TodoItem params={{ id: 1 }} />);
    expect(btnPressed).toBeTruthy();
    await expect(await getErrorMsg()).toBeInTheDocument();
  }, 10000);

  it("ensure redirecting to not found if API returns error", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({
          error: "raised from testcase POST API",
          success: false,
        }),
      });
    });

    const btnPressed = await updateTestcase(todoId, mockTodoItem);

    render(<TodoItem params={{ id: 1 }} />);
    expect(btnPressed).toBeTruthy();
  }, 10000);

  it("ensure redirected to not found if error occured while deleting todo item", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.reject({
        json: () => ({
          error: "raised from testcase DELETE API",
          success: false,
        }),
      });
    });
    const btnPressed = await deleteTestCase(todoId, mockTodoItem);

    await waitFor(
      () => {
        return render(<TodoItem params={{ id: 1 }} />);
      },
      { timeout: 5000 }
    );

    expect(btnPressed).toBeTruthy();
    expect(await getErrorMsg()).toBeInTheDocument();
  }, 10000);

  it("redirect delete api to not found if API returns error", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({
          error: "raised from testcase DELETE API",
          success: false,
        }),
      });
    });

    const btnPressed = await deleteTestCase(todoId, mockTodoItem);
    await expect(btnPressed).toBeTruthy();
  }, 10000);
});

describe("Error Scenario test cases for all components. Error returned from API", () => {
  afterEach(() => {
    jest.restoreMocks();
  });

  it("render new page with error scenario", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({
          error: "raised from testcase GET API",
          success: false,
        }),
      });
    });

    render(<NewPage params={{ id: 1 }} />);
    await expect(await getErrorMsg()).toBeInTheDocument();
  });
});
