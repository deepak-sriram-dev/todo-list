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
    act(() => {
      const { container } = render(<Dashboard />);
      const queryAttr = queryByAttribute.bind(null, "id");
      const button = waitFor(() => queryAttr(container, "addBtn"), {
        timeout: 5000,
      });
      waitFor(() => expect(button).toBeInTheDocument());
    });
  }, 10000);

  it("render dashboard page and click on new and ensure redirected to new page", () => {
    let apiFn = jest.fn();

    useRouter.mockImplementation(() => ({
      pathName: "/",
      push: apiFn,
    }));

    act(async () => {
      render(<Dashboard />);

      const button = await waitFor(() => screen.getByTestId("addBtn"), {
        timeout: 4000,
      });

      fireEvent.click(button);

      await waitFor(() => {
        expect(apiFn).toHaveBeenCalledTimes(1);
        expect(apiFn).toHaveBeenCalledWith("/new/1");
      });
    });
  }, 10000);
});
