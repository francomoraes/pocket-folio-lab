import React from "react";

/**
 * CircularProgress
 *
 * - Pure React component styled only with Tailwind classes.
 * - Uses an SVG arc + Tailwind's `animate-spin` for an infinite indeterminate loader.
 * - Stroke color is controlled via Tailwind text color classes (uses `currentColor`).
 *
 * Props:
 * - size: 'sm' | 'md' | 'lg' | 'xl'  (maps to Tailwind w/h)
 * - thickness: number (strokeWidth on SVG circle)
 * - className: string (extra wrapper classes)
 * - colorClass: string (Tailwind text color class, e.g. 'text-sky-500')
 * - ariaLabel: string (accessibility label)
 */

const SIZE_MAP = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

export default function CircularProgress({
  size = "md",
  thickness = 3,
  className = "",
  colorClass = "text-sky-500",
  ariaLabel = "Loading",
}) {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  // SVG geometry: viewBox 0 0 44 44 => radius ~ 18 (center 22)
  // We draw a full circle as track (faint) and an arc for the moving indicator.
  const strokeWidth = thickness;
  const radius = 18; // matches viewBox
  const circumference = 2 * Math.PI * radius;

  // arc length: we keep a visible arc using stroke-dasharray
  // first value = arc length, second = remaining circumference
  // choose about 25% arc by default
  const arcLength = Math.round(circumference * 0.25);
  const dashArray = `${arcLength} ${Math.round(circumference - arcLength)}`;

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={`${sizeClass} inline-block ${colorClass} ${className}`.trim()}
    >
      <svg
        viewBox="0 0 44 44"
        className="w-full h-full block animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* subtle track */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth={strokeWidth}
        />

        {/* moving arc */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset="0"
          transform="rotate(-90 22 22)"
        />
      </svg>
    </span>
  );
}

/*
Example usage:

import CircularProgress from './CircularProgress'

// small
<CircularProgress size="sm" colorClass="text-rose-500" />

// medium with thicker stroke
<CircularProgress size="md" thickness={4} colorClass="text-sky-600" />

// large
<CircularProgress size="lg" />

Notes:
- The component uses only Tailwind utility classes for layout/colour/animation.
- The arc is created with SVG stroke-dasharray and the whole SVG is rotated with Tailwind's `animate-spin` for an infinite looping effect.
- If you want the spinner to rotate slower/faster, wrap the SVG with a utility like `animate-spin` (default) and customize in your Tailwind config (or replace with an inline style animation if you must).
*/
