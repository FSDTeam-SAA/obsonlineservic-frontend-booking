"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "./brand-mark";

export function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 1020);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className={`site-loader ${isVisible ? "site-loader--visible" : "site-loader--hidden"}`}
      aria-hidden={!isVisible}
    >
      <div className="site-loader__content" role="status" aria-label="Loading Booking Is Yours">
        <div className="site-loader__mark-wrap">
          <BrandMark className="site-loader__mark" title="Booking Is Yours" />
        </div>
        <p className="site-loader__name">BOOKING IS YOURS</p>
        <span className="site-loader__line" />
      </div>
    </div>
  );
}
