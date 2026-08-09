export type LiquidBackgroundLoadState =
  | "idle"
  | "scheduled"
  | "loading"
  | "loaded"
  | "failed";

export type LiquidBackgroundLoadEvent =
  | "schedule"
  | "cancelSchedule"
  | "beginImport"
  | "importSucceeded"
  | "importFailed";

export const transitionLiquidBackgroundLoad = (
  state: LiquidBackgroundLoadState,
  event: LiquidBackgroundLoadEvent
): LiquidBackgroundLoadState => {
  switch (state) {
    case "idle":
      return event === "schedule" ? "scheduled" : state;
    case "scheduled":
      if (event === "cancelSchedule") return "idle";
      return event === "beginImport" ? "loading" : state;
    case "loading":
      if (event === "importSucceeded") return "loaded";
      return event === "importFailed" ? "failed" : state;
    case "loaded":
    case "failed":
      return state;
  }
};
