"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        anchors: true,
        autoRaf: true,
        lerp: 0.06,
        respectReducedMotion: false,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
