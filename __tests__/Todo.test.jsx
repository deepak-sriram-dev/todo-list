import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Todo from "../app/new/[id]/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn((route, { method }) => {
  switch (method) {
    case "GET":
      const fakeResp = {
        title: "untitled",
        id: 1,
        createdAt: "09-09-2024 15:15:15TZ",
      };
      return Promise.resolve({
        json: () => ({ data: fakeResp, success: true }),
      });

    default:
      break;
  }
});

describe("Testcases for Todo Component", () => {
  it("render todo page newly created", async () => {
    render(<Todo params={{ id: "1" }} />);
    const label = screen.getByLabelText("Name");

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1), {
      timeout: 1000,
    });
    await waitFor(() => expect(label.value).toBe("untitled"), {
      timeout: 1000,
    });
  });
});
