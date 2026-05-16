import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/lib/theme";
import { ThemeToggle } from "./ThemeToggle";

function renderWithTheme(initialTheme?: "light" | "dark" | "system") {
  if (initialTheme) {
    localStorage.setItem("theme-preference", initialTheme);
  }
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    // Default matchMedia to light
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("renders sun icon with correct aria-label when theme is light", () => {
    renderWithTheme("light");
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
    // Sun icon has a circle element
    expect(button.innerHTML).toContain("circle");
  });

  it("renders moon icon with correct aria-label when theme is dark", () => {
    renderWithTheme("dark");
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Switch to system mode");
    // Moon icon has a path
    expect(button.innerHTML).toContain("path");
  });

  it("renders monitor icon with correct aria-label when theme is system", () => {
    renderWithTheme("system");
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Switch to light mode");
    // Monitor icon has a rect element
    expect(button.innerHTML).toContain("rect");
  });

  it("cycles from light to dark on click", async () => {
    const user = userEvent.setup();
    renderWithTheme("light");

    const button = screen.getByRole("button");
    await user.click(button);

    expect(button).toHaveAttribute("aria-label", "Switch to system mode");
  });

  it("cycles from dark to system on click", async () => {
    const user = userEvent.setup();
    renderWithTheme("dark");

    const button = screen.getByRole("button");
    await user.click(button);

    expect(button).toHaveAttribute("aria-label", "Switch to light mode");
  });

  it("cycles from system to light on click", async () => {
    const user = userEvent.setup();
    renderWithTheme("system");

    const button = screen.getByRole("button");
    await user.click(button);

    expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
  });
});
