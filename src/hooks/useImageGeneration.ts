import { useState, useCallback, useEffect, useRef } from "react";

const RETRY_DELAYS = [60_000, 30_000, 30_000, 30_000, 30_000];
const MAX_RETRIES = RETRY_DELAYS.length;

export function useImageGeneration() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  const lastRequestRef = useRef<{
    prompt: string;
    model: string;
    guidanceScale: number;
    numInferenceSteps: number;
  } | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cancelRetry();
    };
  }, []);

  const cancelRetry = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    retryCountRef.current = 0;
    setIsRetrying(false);
    setRetryMessage(null);
  }, []);

  const executeRequest = useCallback(
    async (
      requestPrompt: string,
      requestModel: string,
      requestGuidance: number,
      requestSteps: number
    ) => {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: requestPrompt,
          model: requestModel,
          guidance_scale: requestGuidance,
          num_inference_steps: requestSteps,
        }),
      });

      const data = await response.json();

      if (response.status === 202 && data.status === "retrying") {
        return { retrying: true as const, message: data.message as string };
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      return { retrying: false as const, data };
    },
    []
  );

  const scheduleRetry = useCallback(
    async (onSuccess: (data: unknown) => void, onError: (message: string) => void) => {
      if (!lastRequestRef.current || retryCountRef.current >= MAX_RETRIES) {
        setIsRetrying(false);
        setRetryMessage(null);
        setIsLoading(false);
        onError("The image generation service is currently unavailable. Please try again later.");
        return;
      }

      const delay = RETRY_DELAYS[retryCountRef.current];
      retryCountRef.current += 1;

      retryTimerRef.current = setTimeout(async () => {
        if (!isMountedRef.current || !lastRequestRef.current) return;

        const req = lastRequestRef.current;
        try {
          const result = await executeRequest(
            req.prompt,
            req.model,
            req.guidanceScale,
            req.numInferenceSteps
          );

          if (!isMountedRef.current) return;

          if (result.retrying) {
            setRetryMessage(result.message);
            await scheduleRetry(onSuccess, onError);
          } else {
            setIsRetrying(false);
            setRetryMessage(null);
            setIsLoading(false);
            onSuccess(result.data);
          }
        } catch (err) {
          setIsRetrying(false);
          setRetryMessage(null);
          setIsLoading(false);
          onError(err instanceof Error ? err.message : "Something went wrong");
        }
      }, delay);
    },
    [executeRequest]
  );

  const startGeneration = useCallback(
    async (
      effectivePrompt: string,
      model: string,
      guidanceScale: number,
      numInferenceSteps: number,
      onSuccess: (data: unknown) => void,
      onError: (message: string) => void
    ) => {
      cancelRetry();
      setIsLoading(true);

      try {
        const result = await executeRequest(
          effectivePrompt,
          model,
          guidanceScale,
          numInferenceSteps
        );

        if (!isMountedRef.current) return;

        if (result.retrying) {
          setIsRetrying(true);
          setRetryMessage(result.message);
          retryCountRef.current = 1;
          lastRequestRef.current = {
            prompt: effectivePrompt,
            model,
            guidanceScale,
            numInferenceSteps,
          };

          retryTimerRef.current = setTimeout(async () => {
            if (!isMountedRef.current || !lastRequestRef.current) return;
            const req = lastRequestRef.current;
            try {
              const retryResult = await executeRequest(
                req.prompt,
                req.model,
                req.guidanceScale,
                req.numInferenceSteps
              );
              if (!isMountedRef.current) return;

              if (retryResult.retrying) {
                setRetryMessage(retryResult.message);
                await scheduleRetry(onSuccess, onError);
              } else {
                setIsRetrying(false);
                setRetryMessage(null);
                setIsLoading(false);
                onSuccess(retryResult.data);
              }
            } catch (err) {
              setIsRetrying(false);
              setRetryMessage(null);
              setIsLoading(false);
              onError(err instanceof Error ? err.message : "Something went wrong");
            }
          }, RETRY_DELAYS[0]);
        } else {
          onSuccess(result.data);
          setIsLoading(false);
        }
      } catch (err) {
        onError(err instanceof Error ? err.message : "Something went wrong");
        setIsLoading(false);
      }
    },
    [executeRequest, cancelRetry, scheduleRetry]
  );

  return {
    isLoading,
    isRetrying,
    retryMessage,
    startGeneration,
    cancelRetry,
  };
}
