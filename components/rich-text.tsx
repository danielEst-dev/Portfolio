import { Fragment } from "react";

/**
 * RichText — renders inline `**bold**` markup in a plain string.
 * Segments wrapped in `**` become `<strong>`, letting bullet copy
 * front-load metrics (e.g. "shipped **130+ endpoints**") without a
 * heavier markdown dependency. Plain segments pass through untouched,
 * so callers that don't use the markup see exactly their string.
 */
export function RichText({
  text,
  className = "font-semibold text-foreground",
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={className}>
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}