import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
  queryByAttribute,
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

global.fetch = jest.fn((route, { method }) => {
  let promise;

  switch (method) {
    case "GET":
      act(() => {
        promise = Promise.resolve({ json: () => ({ rows: [] }) });
      });
      return promise;

    case "POST":
      act(() => {
        promise = Promise.resolve({
          json: () => ({ message: "success", success: true, id: 1 }),
        });
      });
      return promise;

    case "DELETE":
      return Promise.resolve({
        json: () => ({ message: "success", success: true }),
      });

    default:
      break;
  }
});

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
  it("renders dashbaord page", () => {
    act(() => {
      const { container } = render(<Dashboard />);
      const queryAttr = queryByAttribute.bind(null, "id");
      const button = waitFor(() => queryAttr(container, "addBtn"), {
        timeout: 5000,
      });
      waitFor(() => expect(button).toBeInTheDocument());
    });
  }, 10000);

  it("render dashboard page and click on new and ensure redirected to new page", async () => {
    let apiFn = jest.fn();

    useRouter.mockImplementation(() => ({
      pathName: "/",
      push: apiFn,
    }));

    await act(() => {
      return render(<Dashboard />);
    });

    await act(async () => {
      const button = await waitFor(() => screen.getByTestId("addBtn"), {
        timeout: 4000,
      });

      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(apiFn).toHaveBeenCalledTimes(1);
      expect(apiFn).toHaveBeenCalledWith("/new/1");
    });
  }, 10000);

  it("delete todo from dashboard", async () => {
    let element;
    let component;

    act(() => {
      component = render(<Dashboard />);
      return component;
    });

    await act(async () => {
      element = await waitFor(
        () => {
          return screen.getByTestId("link-card-div");
        },
        {
          timeout: 4000,
        }
      );
      return element;
    });

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
    fireEvent.click(menuItem);
  }, 10000);
});
