import type { PixelGrid } from "../games";

/** Renders a character-grid pixel sprite as a crisp-edged SVG. */
export function PixelSprite({ sprite, label }: { sprite: PixelGrid; label?: string }) {
  const height = sprite.rows.length;
  const width = Math.max(...sprite.rows.map((row) => row.length));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {sprite.rows.flatMap((row, y) =>
        [...row].map((char, x) => {
          const fill = sprite.palette[char];
          if (!fill) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
        }),
      )}
    </svg>
  );
}
