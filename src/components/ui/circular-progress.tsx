import React from "react";

interface CircularProgressProps {
  value?: number; // 0 - 100, if omitted (or null/undefined) the component becomes indeterminate (infinite)
  size?: "sm" | "md" | "lg";
  strokeWidth?: number;
  colorClass?: string; // Tailwind text color class for the progress (ex: "text-sky-500")
  trackClass?: string; // Tailwind text color class for the track (ex: "text-gray-200")
  showLabel?: boolean;
  className?: string;
  /**
   * Optional explicit flag to force indeterminate mode.
   * If true -> indeterminate regardless of `value`.
   * If false (default) -> indeterminate only when `value` is null/undefined.
   */
  indeterminate?: boolean;
}

/**
 * CircularProgress agora suporta modo indeterminado (infinito) quando `value` é omitido
 * ou quando `indeterminate` é true. Reaproveita o SVG; usa `animate-spin` do Tailwind para
 * o efeito infinito e um stroke com gap para parecer um spinner.
 */
export default function CircularProgress({
  value,
  size = "md",
  strokeWidth = 3,
  colorClass = "text-sky-500",
  trackClass = "text-gray-200",
  showLabel = true,
  className = "",
  indeterminate = false,
}: CircularProgressProps) {
  const isIndeterminate = indeterminate || value == null;
  const clamped = isIndeterminate
    ? 0
    : Math.max(0, Math.min(100, value as number));

  const radius = 16; // circle radius in viewBox coords
  const circumference = 2 * Math.PI * radius;

  // Determinate values
  const dashOffset = circumference - (clamped / 100) * circumference;

  // Indeterminate appearance: use a partial dash and rotate the whole SVG
  const indeterminateDashArray = circumference * 0.75;
  const indeterminateDashOffset = circumference * 0.25;

  const sizeMap: Record<
    NonNullable<CircularProgressProps["size"]>,
    { container: string; text: string; viewBox: number }
  > = {
    sm: { container: "w-8 h-8 text-xs", text: "text-xs", viewBox: 36 },
    md: { container: "w-12 h-12 text-sm", text: "text-sm", viewBox: 36 },
    lg: { container: "w-20 h-20 text-base", text: "text-base", viewBox: 36 },
  };

  const sizes = sizeMap[size];

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={isIndeterminate ? undefined : Math.round(clamped)}
      aria-busy={isIndeterminate ? true : undefined}
      className={`inline-flex relative items-center justify-center ${sizes.container} ${className}`}
    >
      <svg
        viewBox="0 0 36 36"
        // Keep the -90deg rotation so 0% starts at top; animate-spin will spin from that base.
        className={`transform -rotate-90 w-full h-full ${
          isIndeterminate ? "animate-spin" : ""
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Track */}
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={`${trackClass} opacity-70`}
        />

        {/* Progress (determinate) or spinner (indeterminate) */}
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={
            isIndeterminate ? indeterminateDashArray : circumference
          }
          strokeDashoffset={
            isIndeterminate ? indeterminateDashOffset : dashOffset
          }
          className={`${colorClass} ${isIndeterminate ? "" : "transition-all"}`}
        />
      </svg>

      {showLabel && !isIndeterminate && (
        <span
          className={`absolute inset-0 flex items-center justify-center font-medium ${sizes.text}`}
        >
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
