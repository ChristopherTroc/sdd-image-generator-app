import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useImageGeneration } from "./useImageGeneration";

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("useImageGeneration", () => {
  it("returns initial state", () => {
    const { result } = renderHook(() => useImageGeneration());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRetrying).toBe(false);
    expect(result.current.retryMessage).toBeNull();
  });

  it("calls onSuccess when fetch succeeds", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ imageUrl: "data:img", prompt: "a cat", id: "1" }),
    });

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() => useImageGeneration());

    await act(async () => {
      await result.current.startGeneration("a cat", "model", 7.5, 30, onSuccess, onError);
    });

    expect(onSuccess).toHaveBeenCalledWith({ imageUrl: "data:img", prompt: "a cat", id: "1" });
    expect(onError).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it("calls onError when fetch fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "API error" }),
    });

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() => useImageGeneration());

    await act(async () => {
      await result.current.startGeneration("a cat", "model", 7.5, 30, onSuccess, onError);
    });

    expect(onError).toHaveBeenCalledWith("API error");
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("sets retrying state on 202 response", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 202,
      ok: true,
      json: async () => ({ status: "retrying", message: "Starting up..." }),
    });

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() => useImageGeneration());

    await act(async () => {
      await result.current.startGeneration("a cat", "model", 7.5, 30, onSuccess, onError);
    });

    expect(result.current.isRetrying).toBe(true);
    expect(result.current.retryMessage).toBe("Starting up...");
  });

  it("schedules retry after 202 and succeeds on retry", async () => {
    vi.useFakeTimers();

    mockFetch.mockResolvedValueOnce({
      status: 202,
      ok: true,
      json: async () => ({ status: "retrying", message: "Starting up..." }),
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ imageUrl: "data:img", prompt: "a cat", id: "1" }),
    });

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() => useImageGeneration());

    await act(async () => {
      result.current.startGeneration("a cat", "model", 7.5, 30, onSuccess, onError);
    });

    expect(result.current.isRetrying).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(61000);
    });

    expect(onSuccess).toHaveBeenCalledWith({ imageUrl: "data:img", prompt: "a cat", id: "1" });
    expect(result.current.isRetrying).toBe(false);

    vi.useRealTimers();
  });

  it("shows error after max retries", async () => {
    vi.useFakeTimers();

    mockFetch.mockResolvedValue({
      status: 202,
      ok: true,
      json: async () => ({ status: "retrying", message: "Starting up..." }),
    });

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() => useImageGeneration());

    await act(async () => {
      result.current.startGeneration("a cat", "model", 7.5, 30, onSuccess, onError);
    });

    expect(result.current.isRetrying).toBe(true);

    await act(async () => {
      for (let i = 0; i < 10; i++) {
        await vi.advanceTimersByTimeAsync(60000);
      }
    });

    expect(onError).toHaveBeenCalled();
    expect(result.current.isRetrying).toBe(false);

    vi.useRealTimers();
  });

  it("handles network error during retry", async () => {
    vi.useFakeTimers();

    mockFetch.mockResolvedValueOnce({
      status: 202,
      ok: true,
      json: async () => ({ status: "retrying", message: "Starting up..." }),
    });
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() => useImageGeneration());

    await act(async () => {
      result.current.startGeneration("a cat", "model", 7.5, 30, onSuccess, onError);
    });

    expect(result.current.isRetrying).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(61000);
    });

    expect(onError).toHaveBeenCalledWith("Network error");

    vi.useRealTimers();
  });

  it("handles string rejection on retry catch", async () => {
    vi.useFakeTimers();

    mockFetch.mockResolvedValueOnce({
      status: 202,
      ok: true,
      json: async () => ({ status: "retrying", message: "Starting up..." }),
    });
    mockFetch.mockRejectedValueOnce("string error");

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() => useImageGeneration());

    await act(async () => {
      result.current.startGeneration("a cat", "model", 7.5, 30, onSuccess, onError);
    });

    expect(result.current.isRetrying).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(61000);
    });

    expect(onError).toHaveBeenCalledWith("Something went wrong");

    vi.useRealTimers();
  });

  it("handles string rejection on startGeneration catch", async () => {
    mockFetch.mockRejectedValueOnce("string error");

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() => useImageGeneration());

    await act(async () => {
      await result.current.startGeneration("a cat", "model", 7.5, 30, onSuccess, onError);
    });

    expect(onError).toHaveBeenCalledWith("Something went wrong");
  });

  it("cancels retry when cancelRetry is called", () => {
    const { result } = renderHook(() => useImageGeneration());

    act(() => {
      result.current.cancelRetry();
    });

    expect(result.current.isRetrying).toBe(false);
    expect(result.current.retryMessage).toBeNull();
  });

  it("ignores state after unmount but still calls onError", async () => {
    const { result, unmount } = renderHook(() => useImageGeneration());

    mockFetch.mockRejectedValueOnce(new Error("Error after unmount"));

    const onSuccess = vi.fn();
    const onError = vi.fn();

    const promise = result.current.startGeneration("a cat", "model", 7.5, 30, onSuccess, onError);

    unmount();

    await act(async () => {
      await promise;
    });

    // After unmount, the catch block still fires onError
    expect(onError).toHaveBeenCalledWith("Error after unmount");
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("cleans up timer on unmount during retry", async () => {
    vi.useFakeTimers();

    mockFetch.mockResolvedValue({
      status: 202,
      ok: true,
      json: async () => ({ status: "retrying", message: "Starting up..." }),
    });

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result, unmount } = renderHook(() => useImageGeneration());

    await act(async () => {
      result.current.startGeneration("a cat", "model", 7.5, 30, onSuccess, onError);
    });

    expect(result.current.isRetrying).toBe(true);

    // Unmount while retry timer is active
    unmount();

    // Advance time — callbacks should not fire
    await act(async () => {
      await vi.advanceTimersByTimeAsync(180000);
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("does not call onError on schedule retry after unmount", async () => {
    vi.useFakeTimers();

    mockFetch.mockResolvedValueOnce({
      status: 202,
      ok: true,
      json: async () => ({ status: "retrying", message: "Starting up..." }),
    });
    // Second call (retry) will throw after unmount
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result, unmount } = renderHook(() => useImageGeneration());

    await act(async () => {
      result.current.startGeneration("a cat", "model", 7.5, 30, onSuccess, onError);
    });

    expect(result.current.isRetrying).toBe(true);

    // Advance to trigger the first retry
    await act(async () => {
      await vi.advanceTimersByTimeAsync(61000);
    });

    // Unmount while retry is in progress
    unmount();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("unmounts during setTimeout catching unmount path", async () => {
    vi.useFakeTimers();

    // First call returns 202 (starts retry)
    mockFetch.mockResolvedValueOnce({
      status: 202,
      ok: true,
      json: async () => ({ status: "retrying", message: "Starting up..." }),
    });
    // Second call (the first retry) never resolves (stuck promise)
    mockFetch.mockReturnValueOnce(new Promise(() => {}));

    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result, unmount } = renderHook(() => useImageGeneration());

    await act(async () => {
      result.current.startGeneration("a cat", "model", 7.5, 30, onSuccess, onError);
    });

    expect(result.current.isRetrying).toBe(true);

    // Advance time to trigger the first retry setTimeout
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60000);
    });

    // Now the setTimeout callback is executing and stuck at await executeRequest
    // Unmount while the retry is in progress
    unmount();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
