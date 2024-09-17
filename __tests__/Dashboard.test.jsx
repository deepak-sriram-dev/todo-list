import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
  waitFor,
  screen,
} from "@testing-library/react";
import Dashboard from "../components/Dashboard";
import { useRouter } from "next/navigation";
import React, { act } from "react";
import NotFound from "../app/not-found";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  notFound: () => <NotFound />,
}));

global.fetch = jest.fn();

const fakeData = [
  {
    id: 1,
    title: "untitled",
    created_at: "2024-09-11T05:54:50.275Z",
  },
];

jest.spyOn(React, "useState").mockImplementation((initialValue) => {
  if (Array.isArray(initialValue) && initialValue.length === 0) {
    return [fakeData, jest.fn()];
  } else if (initialValue === false) {
    return [false, jest.fn()];
  } else if (initialValue === null) {
    return ["buttonEle", jest.fn()];
  } else {
    return [initialValue, jest.fn()];
  }
});

describe("Testcases for Dashboard/Todo Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    useRouter.mockRestore();
  });

  it("renders dashbaord page", () => {
    global.fetch.mockImplementation(() => {
      return Promise.resolve({ json: () => ({ rows: [] }) });
    });

    useRouter.mockImplementation(() => ({
      pathName: `/api/todo`,
      push: jest.fn(),
    }));

    const component = render(<Dashboard />);
    const button = screen.getByTestId("addBtn", { within: component });

    expect(button).toBeInTheDocument();
  }, 10000);

  it("renders dashboard page with todos", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.resolve({ json: () => ({ rows: fakeData }) });
    });

    useRouter.mockImplementation(() => ({
      pathName: `/api/todo`,
      push: jest.fn(),
    }));

    const { container } = render(<Dashboard />);
    const untitled = await waitFor(
      () => {
        return screen.getByLabelText(`todo-id-${fakeData[0].id}`, {
          within: container,
        });
      },
      { timeout: 5000 }
    );

    expect(untitled).toBeInTheDocument();
  }, 10000);

  it("render dashboard page and click on new and ensure redirected to new page", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({ message: "success", success: true, id: 1 }),
      });
    });

    let apiFn = jest.fn(() => {
      title: "untitled";
    });

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

    await expect(button).toBeInTheDocument();
    fireEvent.click(button);

    await waitFor(() => {
      expect(apiFn).toHaveBeenCalledTimes(1);
      expect(apiFn).toHaveBeenCalledWith("/new/1");
    });
  }, 10000);

  it("delete todo from dashboard", async () => {
    global.fetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => ({ rows: fakeData, message: "success", success: true }),
      });
    });

    const { container } = render(<Dashboard />);
    const element = await waitFor(
      () => {
        return screen.getByTestId("link-card-div", { within: container });
      },
      { timeout: 7000 }
    );

    const getTodo = screen.getByText("untitled", { within: element });
    await expect(getTodo).toBeInTheDocument();

    const dropdownEle = screen.getByLabelText("dropdown-more", {
      within: element,
    });
    fireEvent.click(dropdownEle);

    const dashboardEle = await waitFor(() => {
      return screen.getByTestId("dashboard-main");
    });

    const menuItem = await waitFor(
      () => {
        return screen.getByLabelText("dropdown-menu-item", {
          within: dashboardEle,
        });
      },
      { timeout: 5000 }
    );

    await expect(menuItem).toBeInTheDocument();
    const keyPressed = fireEvent.click(menuItem);
    expect(keyPressed).toBeTruthy();
  }, 10000);
});
