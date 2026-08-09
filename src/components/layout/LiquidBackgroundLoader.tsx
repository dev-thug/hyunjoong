"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  transitionLiquidBackgroundLoad,
  type LiquidBackgroundLoadState,
} from "@/lib/liquid-background-loader-state";
import {
  LIQUID_BACKGROUND_INITIAL_DELAY_MS,
  isSoftwareWebGLRenderer,
  shouldEnableLiquidBackground,
} from "@/lib/liquid-background-policy";

type LiquidBackgroundComponent = ComponentType;
type LiquidBackgroundModule = { default: LiquidBackgroundComponent };

type NavigatorWithPerformanceHints = Navigator & {
  readonly connection?: {
    readonly saveData?: boolean;
    readonly effectiveType?: string;
  };
  readonly deviceMemory?: number;
};

type IdleCallback = (deadline: IdleDeadline) => void;

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (callback: IdleCallback, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const IDLE_CALLBACK_TIMEOUT_MS = 1500;

const supportsWebGL = (): boolean => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl");

  if (!context) {
    return false;
  }

  try {
    const debugRendererInfo = context.getExtension(
      "WEBGL_debug_renderer_info"
    );
    const renderer = String(
      debugRendererInfo
        ? context.getParameter(debugRendererInfo.UNMASKED_RENDERER_WEBGL)
        : context.getParameter(context.RENDERER)
    );

    return !isSoftwareWebGLRenderer(renderer);
  } catch {
    return false;
  } finally {
    try {
      context.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      // The temporary probe context is optional; a failure here must keep
      // the static fallback intact rather than surfacing an idle-task error.
    }
  }
};

const LiquidBackgroundLoader = () => {
  const [LiquidBackground, setLiquidBackground] =
    useState<LiquidBackgroundComponent | null>(null);
  const loadStateRef = useRef<LiquidBackgroundLoadState>("idle");
  const importPromiseRef = useRef<Promise<LiquidBackgroundModule> | null>(null);

  useEffect(() => {
    const navigatorWithHints = navigator as NavigatorWithPerformanceHints;
    const getCapabilities = (webglSupported: boolean) => ({
      prefersReducedMotion: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches,
      saveData: navigatorWithHints.connection?.saveData === true,
      webglSupported,
      effectiveConnectionType: navigatorWithHints.connection?.effectiveType,
      deviceMemory: navigatorWithHints.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
    });

    // Do not create a WebGL context during initial hydration. The actual
    // capability probe is deliberately deferred to the idle import path.
    if (!shouldEnableLiquidBackground(getCapabilities(true))) {
      return;
    }

    const browserWindow = window as WindowWithIdleCallback;
    let cancelled = false;
    let delayTimer: number | undefined;
    let idleCallbackId: number | undefined;

    const transition = (event: Parameters<typeof transitionLiquidBackgroundLoad>[1]) => {
      const nextState = transitionLiquidBackgroundLoad(loadStateRef.current, event);
      loadStateRef.current = nextState;
      return nextState;
    };

    const clearScheduledHandles = () => {
      if (delayTimer !== undefined) {
        window.clearTimeout(delayTimer);
        delayTimer = undefined;
      }
      if (idleCallbackId !== undefined) {
        browserWindow.cancelIdleCallback?.(idleCallbackId);
        idleCallbackId = undefined;
      }
    };

    const cancelScheduledLoad = () => {
      clearScheduledHandles();
      transition("cancelSchedule");
    };

    const applyImportedBackground = (Background: LiquidBackgroundComponent) => {
      if (cancelled) {
        return;
      }

      transition("importSucceeded");
      setLiquidBackground(() => Background);
    };

    const handleImportFailure = () => {
      if (!cancelled) {
        transition("importFailed");
      }
    };

    const attachToPendingImport = () => {
      const pendingImport = importPromiseRef.current;
      if (!pendingImport) {
        return;
      }

      void pendingImport
        .then(({ default: Background }) => applyImportedBackground(Background))
        .catch(handleImportFailure);
    };

    const importBackground = () => {
      idleCallbackId = undefined;

      if (cancelled || document.hidden) {
        cancelScheduledLoad();
        return;
      }

      if (loadStateRef.current !== "scheduled") {
        return;
      }

      if (!shouldEnableLiquidBackground(getCapabilities(supportsWebGL()))) {
        cancelScheduledLoad();
        return;
      }

      transition("beginImport");
      const pendingImport =
        importPromiseRef.current ?? import("@/components/LiquidBackground");
      importPromiseRef.current = pendingImport;
      attachToPendingImport();
    };

    const scheduleEnhancement = () => {
      if (loadStateRef.current !== "idle" || document.hidden) {
        return;
      }

      transition("schedule");
      delayTimer = window.setTimeout(() => {
        delayTimer = undefined;

        if (browserWindow.requestIdleCallback) {
          idleCallbackId = browserWindow.requestIdleCallback(importBackground, {
            timeout: IDLE_CALLBACK_TIMEOUT_MS,
          });
          return;
        }

        importBackground();
      }, LIQUID_BACKGROUND_INITIAL_DELAY_MS);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Only pending timers may be cancelled. A started dynamic import is
        // retained and initializes the renderer in its own hidden-tab-safe effect.
        if (loadStateRef.current === "scheduled") {
          cancelScheduledLoad();
        }
      } else {
        scheduleEnhancement();
      }
    };

    if (loadStateRef.current === "loading") {
      // React strict-mode cleanup can occur while the import is in flight. Reuse
      // that promise instead of opening another WebGL capability context/import.
      attachToPendingImport();
    } else if (document.readyState === "complete") {
      scheduleEnhancement();
    } else {
      window.addEventListener("load", scheduleEnhancement, { once: true });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.removeEventListener("load", scheduleEnhancement);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearScheduledHandles();
      if (loadStateRef.current === "scheduled") {
        transition("cancelSchedule");
      }
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="liquid-background-fallback fixed inset-0 -z-10 pointer-events-none"
      />
      {LiquidBackground ? <LiquidBackground /> : null}
    </>
  );
};

export default LiquidBackgroundLoader;
