import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PromptAssistant } from "./PromptAssistant";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe("PromptAssistant", () => {
  it("renders a toggle button", () => {
    render(<PromptAssistant onSelectSuggestion={() => {}} />);
    expect(screen.getByTestId("prompt-assistant-toggle")).toBeInTheDocument();
  });

  it("opens panel on button click", async () => {
    const user = userEvent.setup();
    render(<PromptAssistant onSelectSuggestion={() => {}} />);
    await user.click(screen.getByTestId("prompt-assistant-toggle"));
    expect(screen.getByTestId("prompt-assistant-panel")).toBeInTheDocument();
  });

  it("closes panel on second button click", async () => {
    const user = userEvent.setup();
    render(<PromptAssistant onSelectSuggestion={() => {}} />);
    await user.click(screen.getByTestId("prompt-assistant-toggle"));
    expect(screen.getByTestId("prompt-assistant-panel")).toBeInTheDocument();
    await user.click(screen.getByTestId("prompt-assistant-toggle"));
    expect(screen.queryByTestId("prompt-assistant-panel")).not.toBeInTheDocument();
  });

  it("shows empty state when panel opens", async () => {
    const user = userEvent.setup();
    render(<PromptAssistant onSelectSuggestion={() => {}} />);
    await user.click(screen.getByTestId("prompt-assistant-toggle"));
    expect(screen.getByText(/Type a keyword/)).toBeInTheDocument();
  });

  it("has an input field for keyword", async () => {
    const user = userEvent.setup();
    render(<PromptAssistant onSelectSuggestion={() => {}} />);
    await user.click(screen.getByTestId("prompt-assistant-toggle"));
    expect(screen.getByTestId("prompt-assistant-input")).toBeInTheDocument();
  });

  it("shows loading state while generating", async () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));
    const user = userEvent.setup();
    render(<PromptAssistant onSelectSuggestion={() => {}} />);
    await user.click(screen.getByTestId("prompt-assistant-toggle"));
    const input = screen.getByTestId("prompt-assistant-input");
    await user.type(input, "cat");
    await user.click(screen.getByTestId("prompt-assistant-generate"));
    expect(screen.getByText("Generating ideas...")).toBeInTheDocument();
  });

  it("displays suggestions on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        suggestions: ["A majestic cat", "A cyberpunk cat"],
        keyword: "cat",
      }),
    });
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<PromptAssistant onSelectSuggestion={onSelect} />);
    await user.click(screen.getByTestId("prompt-assistant-toggle"));
    const input = screen.getByTestId("prompt-assistant-input");
    await user.type(input, "cat");
    await user.click(screen.getByTestId("prompt-assistant-generate"));

    expect(await screen.findByText("A majestic cat")).toBeInTheDocument();
    expect(await screen.findByText("A cyberpunk cat")).toBeInTheDocument();
  });

  it("calls onSelectSuggestion when a suggestion is clicked", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        suggestions: ["A majestic cat"],
        keyword: "cat",
      }),
    });
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<PromptAssistant onSelectSuggestion={onSelect} />);
    await user.click(screen.getByTestId("prompt-assistant-toggle"));
    const input = screen.getByTestId("prompt-assistant-input");
    await user.type(input, "cat");
    await user.click(screen.getByTestId("prompt-assistant-generate"));

    const suggestion = await screen.findByText("A majestic cat");
    await user.click(suggestion);
    expect(onSelect).toHaveBeenCalledWith("A majestic cat");
  });

  it("calls onAutoGenerate when a suggestion is clicked", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        suggestions: ["A majestic cat"],
        keyword: "cat",
      }),
    });
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onAutoGenerate = vi.fn();
    render(<PromptAssistant onSelectSuggestion={onSelect} onAutoGenerate={onAutoGenerate} />);
    await user.click(screen.getByTestId("prompt-assistant-toggle"));
    const input = screen.getByTestId("prompt-assistant-input");
    await user.type(input, "cat");
    await user.click(screen.getByTestId("prompt-assistant-generate"));

    const suggestion = await screen.findByText("A majestic cat");
    await user.click(suggestion);
    expect(onSelect).toHaveBeenCalledWith("A majestic cat");
    expect(onAutoGenerate).toHaveBeenCalledWith("A majestic cat");
  });

  it("shows error state with retry button", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "API error" }),
    });
    const user = userEvent.setup();
    render(<PromptAssistant onSelectSuggestion={() => {}} />);
    await user.click(screen.getByTestId("prompt-assistant-toggle"));
    const input = screen.getByTestId("prompt-assistant-input");
    await user.type(input, "cat");
    await user.click(screen.getByTestId("prompt-assistant-generate"));

    expect(await screen.findByText("API error")).toBeInTheDocument();
    expect(screen.getByTestId("prompt-assistant-retry")).toBeInTheDocument();
  });

  it("shows regenerate button when suggestions exist", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        suggestions: ["A majestic cat"],
        keyword: "cat",
      }),
    });
    const user = userEvent.setup();
    render(<PromptAssistant onSelectSuggestion={() => {}} />);
    await user.click(screen.getByTestId("prompt-assistant-toggle"));
    const input = screen.getByTestId("prompt-assistant-input");
    await user.type(input, "cat");
    await user.click(screen.getByTestId("prompt-assistant-generate"));

    expect(await screen.findByText("Regenerate")).toBeInTheDocument();
  });

  it("has dark mode support in panel", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <PromptAssistant onSelectSuggestion={() => {}} />,
    );
    await user.click(screen.getByTestId("prompt-assistant-toggle"));
    expect(container.innerHTML).toContain("dark:");
  });
});
