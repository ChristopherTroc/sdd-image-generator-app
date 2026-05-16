import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "./theme";

// --- Helpers ---

function TestConsumer() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button data-testid="set-light" onClick={() => setTheme("light")}>
        Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme("dark")}>
        Dark
      </button>
      <button data-testid="set-system" onClick={() => setTheme("system")}>
        System
      </button>
    </div>
  );
}

function renderWithProvider(initialTheme?: "light" | "dark" | "system") {
  if (initialTheme) {
    localStorage.setItem("theme-preference", initialTheme);
  }
  return render(
    <ThemeProvider>
      <TestConsumer />
    </ThemeProvider>,
  );
}

function ThrowTest() {
  useTheme();
  return null;
}

// --- Setup ---

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
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

// --- Tests ---

describe("ThemeProvider", () => {
  describe("useTheme", () => {
    it("returns default values when no preference is stored", () => {
      renderWithProvider();
      expect(screen.getByTestId("theme")).toHaveTextContent("system");
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light");
    });

    it("reads stored light preference from localStorage", () => {
      renderWithProvider("light");
      expect(screen.getByTestId("theme")).toHaveTextContent("light");
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light");
    });

    it("reads stored dark preference from localStorage", () => {
      renderWithProvider("dark");
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
    });

    it("reads stored system preference from localStorage", () => {
      renderWithProvider("system");
      expect(screen.getByTestId("theme")).toHaveTextContent("system");
    });

    it("throws if used outside ThemeProvider", () => {
      expect(() => render(<ThrowTest />)).toThrow(
        "useTheme must be used within a ThemeProvider",
      );
    });
  });

  describe("setTheme", () => {
    it("updates theme to dark", async () => {
      const user = userEvent.setup();
      renderWithProvider("light");
      await user.click(screen.getByTestId("set-dark"));
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
    });

    it("updates theme to light", async () => {
      const user = userEvent.setup();
      renderWithProvider("dark");
      await user.click(screen.getByTestId("set-light"));
      expect(screen.getByTestId("theme")).toHaveTextContent("light");
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light");
    });

    it("updates theme to system", async () => {
      const user = userEvent.setup();
      renderWithProvider("dark");
      await user.click(screen.getByTestId("set-system"));
      expect(screen.getByTestId("theme")).toHaveTextContent("system");
    });

    it("persists theme to localStorage", async () => {
      const user = userEvent.setup();
      renderWithProvider("light");
      await user.click(screen.getByTestId("set-dark"));
      expect(localStorage.getItem("theme-preference")).toBe("dark");
    });
  });

  describe("dark class on document", () => {
    it("adds dark class when theme is dark", () => {
      renderWithProvider("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("removes dark class when theme is light", () => {
      renderWithProvider("light");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("toggles dark class when switching themes", async () => {
      const user = userEvent.setup();
      renderWithProvider("light");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      await user.click(screen.getByTestId("set-dark"));
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      await user.click(screen.getByTestId("set-light"));
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });

  describe("localStorage error handling", () => {
    it("defaults to system when localStorage has invalid value", () => {
      localStorage.setItem("theme-preference", "invalid-value");
      renderWithProvider();
      expect(screen.getByTestId("theme")).toHaveTextContent("system");
    });

    it("resolves to dark when system preference is dark", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      renderWithProvider("system");
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
    });

    it("handles localStorage being unavailable", () => {
      const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("localStorage unavailable");
      });
      const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("localStorage unavailable");
      });

      renderWithProvider();
      expect(screen.getByTestId("theme")).toHaveTextContent("system");

      getItem.mockRestore();
      setItem.mockRestore();
    });
  });

  describe("system preference listener", () => {
    it("calls setResolvedTheme when system preference changes to dark", () => {
      let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: (_: string, handler: typeof changeHandler) => {
          changeHandler = handler;
        },
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      renderWithProvider("system");
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light");

      // Simulate system preference changing to dark
      act(() => {
        changeHandler?.({ matches: true } as MediaQueryListEvent);
      });

      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
    });

    it("calls setResolvedTheme when system preference changes to light", () => {
      let changeHandler: ((e: MediaQueryListEvent) => void) | null = null;
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: (_: string, handler: typeof changeHandler) => {
          changeHandler = handler;
        },
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      renderWithProvider("system");
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");

      // Simulate system preference changing to light
      act(() => {
        changeHandler?.({ matches: false } as MediaQueryListEvent);
      });

      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light");
    });

    it("cleans up listener when switching from system to a specific theme", async () => {
      const removeEventListener = vi.fn();
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const user = userEvent.setup();
      renderWithProvider("system");

      // Switch away from "system", triggering cleanup
      await user.click(screen.getByTestId("set-dark"));

      expect(removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    });
  });
});
