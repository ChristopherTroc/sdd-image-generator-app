import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageGenerator } from "./ImageGenerator";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
  vi.useRealTimers();
});

describe("ImageGenerator", () => {
  it("renders the prompt textarea and generate button", () => {
    render(<ImageGenerator />);
    expect(
      screen.getByPlaceholderText("Describe the image you want to generate in detail...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate/i })).toBeInTheDocument();
  });

  it("textarea supports multi-line input", () => {
    render(<ImageGenerator />);
    const textarea = screen.getByPlaceholderText(
      "Describe the image you want to generate in detail..."
    );
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("disables generate button when input is empty", () => {
    render(<ImageGenerator />);
    expect(screen.getByRole("button", { name: /generate/i })).toBeDisabled();
  });

  it("enables generate button when input has text", async () => {
    const user = userEvent.setup();
    render(<ImageGenerator />);
    const textarea = screen.getByPlaceholderText(
      "Describe the image you want to generate in detail..."
    );
    await user.type(textarea, "a cat");
    expect(screen.getByRole("button", { name: /generate/i })).toBeEnabled();
  });

  it("shows loading state while generating", async () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));
    const user = userEvent.setup();
    render(<ImageGenerator />);

    const textarea = screen.getByPlaceholderText(
      "Describe the image you want to generate in detail..."
    );
    await user.type(textarea, "a cat");
    await user.click(screen.getByRole("button", { name: /generate/i }));

    expect(screen.getByText("Generating...")).toBeInTheDocument();
  });

  it("displays the generated image on success", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        imageUrl: "https://example.com/image.png",
        prompt: "a cat",
        id: "123",
      }),
    });

    render(<ImageGenerator />);
    const textarea = screen.getByPlaceholderText(
      "Describe the image you want to generate in detail..."
    );
    await user.type(textarea, "a cat");
    await user.click(screen.getByRole("button", { name: /generate/i }));

    const img = await screen.findByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/image.png");
    expect(img).toHaveAttribute("alt", "a cat");
  });

  it("shows error message on failure", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "API error" }),
    });

    render(<ImageGenerator />);
    const textarea = screen.getByPlaceholderText(
      "Describe the image you want to generate in detail..."
    );
    await user.type(textarea, "a cat");
    await user.click(screen.getByRole("button", { name: /generate/i }));

    expect(await screen.findByText("API error")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try Again" })).toBeInTheDocument();
  });

  it("generates on Enter key press", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        imageUrl: "https://example.com/image.png",
        prompt: "a cat",
        id: "123",
      }),
    });

    render(<ImageGenerator />);
    const textarea = screen.getByPlaceholderText(
      "Describe the image you want to generate in detail..."
    );
    await user.type(textarea, "a cat{Enter}");

    const img = await screen.findByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/image.png");
  });

  it("has download button when image is generated", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        imageUrl: "https://example.com/image.png",
        prompt: "a cat",
        id: "123",
      }),
    });

    render(<ImageGenerator />);
    const textarea = screen.getByPlaceholderText(
      "Describe the image you want to generate in detail..."
    );
    await user.type(textarea, "a cat");
    await user.click(screen.getByRole("button", { name: /generate/i }));

    await screen.findByRole("img");
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  it("download button is clickable when image is present", async () => {
    const user = userEvent.setup();
    const createElementSpy = vi.spyOn(document, "createElement");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        imageUrl: "https://example.com/image.png",
        prompt: "a cat",
        id: "123",
      }),
    });

    render(<ImageGenerator />);
    const textarea = screen.getByPlaceholderText(
      "Describe the image you want to generate in detail..."
    );
    await user.type(textarea, "a cat");
    await user.click(screen.getByRole("button", { name: /generate/i }));
    await screen.findByRole("img");

    const downloadBtn = screen.getByText("Download");
    await user.click(downloadBtn);

    expect(createElementSpy).toHaveBeenCalledWith("a");
    createElementSpy.mockRestore();
  });

  it("calls onGeneration callback with result", async () => {
    const user = userEvent.setup();
    const onGeneration = vi.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        imageUrl: "https://example.com/image.png",
        prompt: "a cat",
        id: "123",
      }),
    });

    render(<ImageGenerator onGeneration={onGeneration} />);
    const textarea = screen.getByPlaceholderText(
      "Describe the image you want to generate in detail..."
    );
    await user.type(textarea, "a cat");
    await user.click(screen.getByRole("button", { name: /generate/i }));

    await screen.findByRole("img");
    expect(onGeneration).toHaveBeenCalledWith({
      imageUrl: "https://example.com/image.png",
      prompt: "a cat",
      id: "123",
    });
  });

  describe("zoom modal", () => {
    it("opens zoom modal when clicking the image", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          imageUrl: "https://example.com/image.png",
          prompt: "a cat",
          id: "123",
        }),
      });

      render(<ImageGenerator />);
      const textarea = screen.getByPlaceholderText(
        "Describe the image you want to generate in detail..."
      );
      await user.type(textarea, "a cat");
      await user.click(screen.getByRole("button", { name: /generate/i }));

      const img = await screen.findByRole("img");
      await user.click(img);

      // Modal should be open - look for the close button
      const closeBtn = screen.getByLabelText("Close zoom");
      expect(closeBtn).toBeInTheDocument();
    });

    it("closes zoom modal on X button click", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          imageUrl: "https://example.com/image.png",
          prompt: "a cat",
          id: "123",
        }),
      });

      render(<ImageGenerator />);
      const textarea = screen.getByPlaceholderText(
        "Describe the image you want to generate in detail..."
      );
      await user.type(textarea, "a cat");
      await user.click(screen.getByRole("button", { name: /generate/i }));

      const img = await screen.findByRole("img");
      await user.click(img);

      const closeBtn = screen.getByLabelText("Close zoom");
      await user.click(closeBtn);

      expect(screen.queryByLabelText("Close zoom")).not.toBeInTheDocument();
    });

    it("shows download button inside zoom modal", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          imageUrl: "https://example.com/image.png",
          prompt: "a cat",
          id: "123",
        }),
      });

      render(<ImageGenerator />);
      const textarea = screen.getByPlaceholderText(
        "Describe the image you want to generate in detail..."
      );
      await user.type(textarea, "a cat");
      await user.click(screen.getByRole("button", { name: /generate/i }));

      const img = await screen.findByRole("img");
      await user.click(img);

      // There should be two download buttons (card + modal)
      const downloadBtns = screen.getAllByText("Download");
      expect(downloadBtns.length).toBe(2);
    });

    it("closes zoom modal on Escape key", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          imageUrl: "https://example.com/image.png",
          prompt: "a cat",
          id: "123",
        }),
      });

      render(<ImageGenerator />);
      const textarea = screen.getByPlaceholderText(
        "Describe the image you want to generate in detail..."
      );
      await user.type(textarea, "a cat");
      await user.click(screen.getByRole("button", { name: /generate/i }));

      const img = await screen.findByRole("img");
      await user.click(img);

      expect(screen.getByLabelText("Close zoom")).toBeInTheDocument();

      // Press Escape
      await user.keyboard("{Escape}");

      expect(screen.queryByLabelText("Close zoom")).not.toBeInTheDocument();
    });
  });

  describe("settings panel", () => {
    it("renders settings panel collapsed by default", () => {
      render(<ImageGenerator />);
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.queryByText("Model")).not.toBeInTheDocument();
    });

    it("expands settings panel when clicking Settings button", async () => {
      const user = userEvent.setup();
      render(<ImageGenerator />);
      await user.click(screen.getByText("Settings"));
      expect(screen.getByText("Model")).toBeInTheDocument();
      expect(screen.getByText(/Steps/)).toBeInTheDocument();
    });

    it("collapses settings panel when clicking Hide settings", async () => {
      const user = userEvent.setup();
      render(<ImageGenerator />);
      await user.click(screen.getByText("Settings"));
      expect(screen.getByText("Model")).toBeInTheDocument();
      await user.click(screen.getByText("Hide settings"));
      expect(screen.queryByText("Model")).not.toBeInTheDocument();
    });

    it("renders model selector with Stable Diffusion XL Base as default", async () => {
      const user = userEvent.setup();
      render(<ImageGenerator />);
      await user.click(screen.getByText("Settings"));
      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("stable-diffusion-xl-base-1-0-hnm");
    });

    it("includes settings in the POST request", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          imageUrl: "https://example.com/img.png",
          prompt: "a cat",
          id: "1",
        }),
      });

      render(<ImageGenerator />);
      const textarea = screen.getByPlaceholderText(
        "Describe the image you want to generate in detail..."
      );
      await user.type(textarea, "a cat");

      await user.click(screen.getByRole("button", { name: /generate/i }));
      await screen.findByRole("img");

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.model).toBe("stable-diffusion-xl-base-1-0-hnm");
      expect(requestBody.guidance_scale).toBe(7.5);
      expect(requestBody.num_inference_steps).toBe(30);
    });

    it("includes prompt when settings are used", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          imageUrl: "https://example.com/img.png",
          prompt: "a cat",
          id: "1",
        }),
      });

      render(<ImageGenerator />);
      const textarea = screen.getByPlaceholderText(
        "Describe the image you want to generate in detail..."
      );
      await user.type(textarea, "a cat");
      await user.click(screen.getByRole("button", { name: /generate/i }));
      await screen.findByRole("img");

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.prompt).toBe("a cat");
    });

    it("inference steps slider is visible in settings", async () => {
      const user = userEvent.setup();
      render(<ImageGenerator />);
      await user.click(screen.getByText("Settings"));
      expect(screen.getByText(/Steps/)).toBeInTheDocument();
      expect(screen.getByText(/better quality/)).toBeInTheDocument();
    });

    it("model selector has two options with SD as default", async () => {
      const user = userEvent.setup();
      render(<ImageGenerator />);
      await user.click(screen.getByText("Settings"));
      const select = screen.getByRole("combobox");
      expect(select).toBeEnabled();
      expect(select).toHaveValue("stable-diffusion-xl-base-1-0-hnm");
      const options = Array.from(select.querySelectorAll("option"));
      expect(options.length).toBe(2);
      expect(options[0].value).toBe("stable-diffusion-xl-base-1-0-hnm");
      expect(options[1].value).toBe("black-forest-labs/FLUX.1-schnell");
    });

    it("switches model to Stable Diffusion XL when selected", async () => {
      const user = userEvent.setup();
      render(<ImageGenerator />);
      await user.click(screen.getByText("Settings"));
      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "stable-diffusion-xl-base-1-0-hnm");
      expect(select).toHaveValue("stable-diffusion-xl-base-1-0-hnm");
    });
  });

  describe("retry on 503", () => {
    it("shows retrying info banner on 202 response", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        status: 202,
        ok: true,
        json: async () => ({
          status: "retrying",
          message:
            "The image generation service is starting up. This may take up to a minute. Please wait...",
        }),
      });

      render(<ImageGenerator />);
      const textarea = screen.getByPlaceholderText(
        "Describe the image you want to generate in detail..."
      );
      await user.type(textarea, "a cat");
      await user.click(screen.getByRole("button", { name: /generate/i }));

      expect(await screen.findByText(/starting up/)).toBeInTheDocument();
      expect(screen.getByText("Generating...")).toBeInTheDocument();
    });

    it("handles multiple 202 responses gracefully", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        status: 202,
        ok: true,
        json: async () => ({
          status: "retrying",
          message: "Service starting up...",
        }),
      });

      render(<ImageGenerator />);
      const textarea = screen.getByPlaceholderText(
        "Describe the image you want to generate in detail..."
      );
      await user.type(textarea, "a cat");
      await user.click(screen.getByRole("button", { name: /generate/i }));

      expect(await screen.findByText(/starting up/)).toBeInTheDocument();
    });
  });

  describe("image error handling", () => {
    it("shows error when image fails to load", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          imageUrl: "https://example.com/broken.png",
          prompt: "a cat",
          id: "123",
        }),
      });

      render(<ImageGenerator />);
      const textarea = screen.getByPlaceholderText(
        "Describe the image you want to generate in detail..."
      );
      await user.type(textarea, "a cat");
      await user.click(screen.getByRole("button", { name: /generate/i }));

      const img = await screen.findByRole("img");
      img.dispatchEvent(new Event("error"));

      expect(await screen.findByText(/Failed to load generated image/)).toBeInTheDocument();
    });
  });

  describe("forceResult prop", () => {
    it("displays forced result image", () => {
      render(
        <ImageGenerator
          forceResult={{
            imageUrl: "https://example.com/forced.png",
            prompt: "forced prompt",
            id: "999",
          }}
        />
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "https://example.com/forced.png");
      expect(screen.getByText(/forced prompt/)).toBeInTheDocument();
    });

    it("shows download button for forced result", () => {
      render(
        <ImageGenerator
          forceResult={{
            imageUrl: "https://example.com/forced.png",
            prompt: "forced prompt",
            id: "999",
          }}
        />
      );
      expect(screen.getByText("Download")).toBeInTheDocument();
    });
  });

  describe("keyboard navigation", () => {
    it("does not generate on Shift+Enter", async () => {
      const user = userEvent.setup();
      render(<ImageGenerator />);
      const textarea = screen.getByPlaceholderText(
        "Describe the image you want to generate in detail..."
      );
      await user.type(textarea, "a cat");
      await user.keyboard("{Shift>}{Enter}{/Shift}");
      // Should still be loading (not triggered by Shift+Enter)
      expect(screen.queryByText("Generating...")).not.toBeInTheDocument();
    });
  });
});
