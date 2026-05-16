import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("Home", () => {
  it("renders the page title and description", () => {
    render(<Home />);
    expect(screen.getByText("AI Image Generator")).toBeInTheDocument();
    expect(
      screen.getByText("Describe any image and let AI bring it to life"),
    ).toBeInTheDocument();
  });

  it("renders the ImageGenerator textarea", () => {
    render(<Home />);
    expect(
      screen.getByPlaceholderText("Describe the image you want to generate in detail..."),
    ).toBeInTheDocument();
  });

  it("renders empty history state", () => {
    render(<Home />);
    expect(screen.getByText("No generations yet")).toBeInTheDocument();
  });

  it("sets prompt from history on item click", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        imageUrl: "https://example.com/img.png",
        prompt: "a cat",
        id: "1",
      }),
    });

    render(<Home />);
    const textarea = screen.getByPlaceholderText("Describe the image you want to generate in detail...");
    await user.type(textarea, "a cat");
    await user.click(screen.getByRole("button", { name: /generate/i }));
    await screen.findAllByRole("img");

    // Click the history item using its title attribute
    const historyItem = screen.getByTitle("Re-use prompt: a cat");
    await user.click(historyItem);

    expect(textarea).toHaveValue("a cat");
  });

  it("adds generation to history after successful generation", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        imageUrl: "https://example.com/img.png",
        prompt: "a cat",
        id: "1",
      }),
    });

    render(<Home />);
    const textarea = screen.getByPlaceholderText("Describe the image you want to generate in detail...");
    await user.type(textarea, "a cat");
    await user.click(screen.getByRole("button", { name: /generate/i }));

    const images = await screen.findAllByRole("img");
    expect(images.length).toBe(2);
    expect(screen.getByText("History (1)")).toBeInTheDocument();
    expect(screen.getByTitle("Re-use prompt: a cat")).toBeInTheDocument();
  });
});
