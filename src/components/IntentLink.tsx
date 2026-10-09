"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";

/** Keep linked pages out of the initial waterfall; warm them on user intent. */
export default function IntentLink({
  onPointerEnter,
  onFocus,
  onTouchStart,
  prefetch,
  ...props
}: ComponentProps<typeof Link>) {
  const [hasIntent, setHasIntent] = useState(false);

  return (
    <Link
      {...props}
      prefetch={prefetch === false ? false : hasIntent ? prefetch ?? null : false}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (prefetch !== false && !event.defaultPrevented && event.pointerType !== "touch") setHasIntent(true);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (prefetch !== false && !event.defaultPrevented) setHasIntent(true);
      }}
      onTouchStart={(event) => {
        onTouchStart?.(event);
        if (prefetch !== false && !event.defaultPrevented) setHasIntent(true);
      }}
    />
  );
}
