import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
  queryByAttribute,
  waitFor,
} from "@testing-library/react";
import Dashboard from "../components/Dashboard";
import { useRouter } from "next/navigation";
import { act } from "react";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
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

    default:
      break;
  }
});

describe("Testcases for Dashboard Component", () => {
  it("renders dashbaord page", () => {
    let component;

    act(() => {
      component = render(<Dashboard />);
    });
    const { container } = component;
    const queryAttr = queryByAttribute.bind(null, "id");
    const button = queryAttr(container, "addBtn");
    expect(button).toBeInTheDocument();
  });

  it("render dashboard page and click on new todo and redirect to new page - success", async () => {
    const apiFn = jest.fn();
    let component;

    useRouter.mockImplementation(() => ({
      pathName: "/",
      push: apiFn,
    }));

    act(() => {
      component = render(<Dashboard />);
    });
    const { container } = component;
    const queryAttr = queryByAttribute.bind(null, "id");
    const button = await queryAttr(container, "addBtn");

    fireEvent.click(button);

    await waitFor(() =>
      act(async () => {
        await expect(apiFn).toHaveBeenCalledWith("/new/1");
      })
    );
  });
});
