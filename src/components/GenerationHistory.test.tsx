import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenerationHistory } from "./GenerationHistory";

const mockGenerations = [
  { imageUrl: "https://example.com/img1.png", prompt: "a cat", id: "1" },
  { imageUrl: "https://example.com/img2.png", prompt: "a dog", id: "2" },
];

describe("GenerationHistory", () => {
  it("shows empty state when no generations", () => {
    render(
      <GenerationHistory generations={[]} onSelectPrompt={vi.fn()} />,
    );
    expect(screen.getByText("No generations yet")).toBeInTheDocument();
  });

  it("renders generation items", () => {
    render(
      <GenerationHistory
        generations={mockGenerations}
        onSelectPrompt={vi.fn()}
      />,
    );
    expect(screen.getByText("History (2)")).toBeInTheDocument();
    expect(screen.getByText("a cat")).toBeInTheDocument();
    expect(screen.getByText("a dog")).toBeInTheDocument();
  });

  it("renders images with correct src", () => {
    render(
      <GenerationHistory
        generations={mockGenerations}
        onSelectPrompt={vi.fn()}
      />,
    );
    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("src", "https://example.com/img1.png");
    expect(images[1]).toHaveAttribute("src", "https://example.com/img2.png");
  });

  it("calls onSelectPrompt when a history item is clicked", async () => {
    const user = userEvent.setup();
    const onSelectPrompt = vi.fn();
    render(
      <GenerationHistory
        generations={mockGenerations}
        onSelectPrompt={onSelectPrompt}
      />,
    );
    await user.click(screen.getByText("a cat"));
    expect(onSelectPrompt).toHaveBeenCalledWith("a cat");
  });
});
