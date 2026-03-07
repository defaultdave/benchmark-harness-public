"use client";

// Lightweight SVG chart components — zero dependencies

interface BarChartProps {
  title: string;
  data: { label: string; values: { label: string; value: number; color: string }[] }[];
  unit?: string;
  maxValue?: number;
  height?: number;
}

export function GroupedBarChart({ title, data, unit = "", maxValue, height }: BarChartProps) {
  const allValues = data.flatMap((d) => d.values.map((v) => v.value));
  const max = maxValue ?? Math.max(...allValues) * 1.15;
  const barHeight = 22;
  const groupGap = 16;
  const barGap = 4;
  const labelWidth = 180;
  const chartWidth = 600;
  const barAreaWidth = chartWidth - labelWidth - 20;

  const totalHeight =
    height ??
    data.reduce((h, group) => h + group.values.length * (barHeight + barGap) + groupGap, 0) + 20;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">{title}</h3>
      <svg
        viewBox={`0 0 ${chartWidth} ${totalHeight}`}
        className="w-full max-w-2xl"
        role="img"
        aria-label={title}
      >
        {(() => {
          let y = 10;
          const groups = data.map((group, gi) => {
            const groupY = y;
            const bars = group.values.map((val, vi) => {
              const barW = max > 0 ? (val.value / max) * barAreaWidth : 0;
              const currentY = y;
              y += barHeight + barGap;
              return (
                <g key={vi}>
                  <rect
                    x={labelWidth}
                    y={currentY}
                    width={Math.max(barW, 1)}
                    height={barHeight}
                    fill={val.color}
                    rx={3}
                  />
                  <text
                    x={labelWidth + barW + 6}
                    y={currentY + barHeight / 2 + 1}
                    fontSize={11}
                    fill="#374151"
                    dominantBaseline="middle"
                  >
                    {formatNumber(val.value)}{unit ? ` ${unit}` : ""}
                  </text>
                </g>
              );
            });
            y += groupGap;
            const groupMidY = groupY + (group.values.length * (barHeight + barGap)) / 2;
            return (
              <g key={gi}>
                <text
                  x={labelWidth - 8}
                  y={groupMidY}
                  fontSize={11}
                  fill="#374151"
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {group.label}
                </text>
                {bars}
                {gi < data.length - 1 && (
                  <line x1={0} y1={y - groupGap / 2} x2={chartWidth} y2={y - groupGap / 2} stroke="#e5e7eb" strokeWidth={1} />
                )}
              </g>
            );
          });
          return [
            <line key="top" x1={0} y1={10 - groupGap / 2} x2={chartWidth} y2={10 - groupGap / 2} stroke="#e5e7eb" strokeWidth={1} />,
            ...groups,
            <line key="bottom" x1={0} y1={totalHeight - groupGap / 2 - 10} x2={chartWidth} y2={totalHeight - groupGap / 2 - 10} stroke="#e5e7eb" strokeWidth={1} />,
          ];
        })()}
      </svg>
      {data[0]?.values.length > 1 && (
        <div className="flex gap-4 text-xs text-gray-600">
          {data[0].values.map((v, i) => (
            <span key={i} className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: v.color }}
              />
              {v.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface HorizontalBarProps {
  title: string;
  bars: { label: string; value: number; color: string; annotation?: string }[];
  unit?: string;
  maxValue?: number;
}

export function HorizontalBarChart({ title, bars, unit = "", maxValue }: HorizontalBarProps) {
  const max = maxValue ?? Math.max(...bars.map((b) => b.value)) * 1.15;
  const barHeight = 28;
  const gap = 8;
  const labelWidth = 160;
  const chartWidth = 600;
  const barAreaWidth = chartWidth - labelWidth - 20;
  const totalHeight = bars.length * (barHeight + gap) + 20;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">{title}</h3>
      <svg
        viewBox={`0 0 ${chartWidth} ${totalHeight}`}
        className="w-full max-w-2xl"
        role="img"
        aria-label={title}
      >
        <line x1={0} y1={10 - gap / 2} x2={chartWidth} y2={10 - gap / 2} stroke="#e5e7eb" strokeWidth={1} />
        {bars.map((bar, i) => {
          const y = 10 + i * (barHeight + gap);
          const barW = max > 0 ? (bar.value / max) * barAreaWidth : 0;
          return (
            <g key={i}>
              <text
                x={labelWidth - 8}
                y={y + barHeight / 2}
                fontSize={11}
                fill="#374151"
                textAnchor="end"
                dominantBaseline="middle"
              >
                {bar.label}
              </text>
              <rect
                x={labelWidth}
                y={y}
                width={Math.max(barW, 1)}
                height={barHeight}
                fill={bar.color}
                rx={3}
              />
              <text
                x={labelWidth + barW + 6}
                y={y + barHeight / 2}
                fontSize={11}
                fill="#374151"
                dominantBaseline="middle"
              >
                {bar.value}{unit ? ` ${unit}` : ""}{bar.annotation ? ` ${bar.annotation}` : ""}
              </text>
              {i < bars.length - 1 && (
                <line x1={0} y1={y + barHeight + gap / 2} x2={chartWidth} y2={y + barHeight + gap / 2} stroke="#e5e7eb" strokeWidth={1} />
              )}
            </g>
          );
        })}
        <line x1={0} y1={10 + bars.length * (barHeight + gap) - gap / 2} x2={chartWidth} y2={10 + bars.length * (barHeight + gap) - gap / 2} stroke="#e5e7eb" strokeWidth={1} />
      </svg>
    </div>
  );
}

interface ComparisonBarProps {
  title: string;
  items: {
    label: string;
    leftValue: number;
    rightValue: number;
    winner: "left" | "right";
    margin: string;
  }[];
  leftLabel: string;
  rightLabel: string;
  leftColor: string;
  rightColor: string;
  unit?: string;
}

export function ComparisonBarChart({
  title,
  items,
  leftLabel,
  rightLabel,
  leftColor,
  rightColor,
  unit = "ops/sec",
}: ComparisonBarProps) {
  const allValues = items.flatMap((i) => [i.leftValue, i.rightValue]);
  const maxVal = Math.max(...allValues) * 1.15;
  const barHeight = 18;
  const pairGap = 20;
  const labelWidth = 180;
  const chartWidth = 650;
  const barAreaWidth = chartWidth - labelWidth - 20;
  const totalHeight = items.length * (barHeight * 2 + 6 + pairGap) + 20;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">{title}</h3>
      <div className="flex gap-4 text-xs text-gray-600 mb-1">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: leftColor }} />
          {leftLabel}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: rightColor }} />
          {rightLabel}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${chartWidth} ${totalHeight}`}
        className="w-full max-w-2xl"
        role="img"
        aria-label={title}
      >
        <line x1={0} y1={10 - pairGap / 2} x2={chartWidth} y2={10 - pairGap / 2} stroke="#e5e7eb" strokeWidth={1} />
        {items.map((item, i) => {
          const groupY = 10 + i * (barHeight * 2 + 6 + pairGap);
          const leftW = maxVal > 0 ? (item.leftValue / maxVal) * barAreaWidth : 0;
          const rightW = maxVal > 0 ? (item.rightValue / maxVal) * barAreaWidth : 0;
          const midY = groupY + barHeight + 3;

          return (
            <g key={i}>
              <text
                x={labelWidth - 8}
                y={midY}
                fontSize={11}
                fill="#374151"
                textAnchor="end"
                dominantBaseline="middle"
              >
                {item.label}
              </text>
              {/* Left bar */}
              <rect x={labelWidth} y={groupY} width={Math.max(leftW, 1)} height={barHeight} fill={leftColor} rx={3} />
              <text x={labelWidth + leftW + 5} y={groupY + barHeight / 2} fontSize={10} fill="#374151" dominantBaseline="middle">
                {formatNumber(item.leftValue)} {unit}
              </text>
              {/* Right bar */}
              <rect x={labelWidth} y={groupY + barHeight + 4} width={Math.max(rightW, 1)} height={barHeight} fill={rightColor} rx={3} />
              <text x={labelWidth + rightW + 5} y={groupY + barHeight + 4 + barHeight / 2} fontSize={10} fill="#374151" dominantBaseline="middle">
                {formatNumber(item.rightValue)} {unit}
              </text>
              {/* Winner badge */}
              <text
                x={chartWidth - 5}
                y={midY}
                fontSize={10}
                fill={item.winner === "left" ? leftColor : rightColor}
                textAnchor="end"
                dominantBaseline="middle"
                fontWeight="bold"
              >
                {item.margin}
              </text>
              {i < items.length - 1 && (
                <line x1={0} y1={groupY + barHeight * 2 + 4 + pairGap / 2} x2={chartWidth} y2={groupY + barHeight * 2 + 4 + pairGap / 2} stroke="#e5e7eb" strokeWidth={1} />
              )}
            </g>
          );
        })}
        <line x1={0} y1={10 + (items.length - 1) * (barHeight * 2 + 6 + pairGap) + barHeight * 2 + 4 + pairGap / 2} x2={chartWidth} y2={10 + (items.length - 1) * (barHeight * 2 + 6 + pairGap) + barHeight * 2 + 4 + pairGap / 2} stroke="#e5e7eb" strokeWidth={1} />
      </svg>
    </div>
  );
}

interface ScorecardRow {
  label: string;
  grades: { value: string; color: string }[];
  verdict: string;
  verdictColor: string;
}

export function ScorecardTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: ScorecardRow[];
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              {headers.map((h) => (
                <th key={h} className="border px-3 py-2 text-left font-medium text-gray-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="hover:bg-gray-50">
                <td className="border px-3 py-2 font-medium">{row.label}</td>
                {row.grades.map((g, i) => (
                  <td key={i} className="border px-3 py-2 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${g.color}`}>
                      {g.value}
                    </span>
                  </td>
                ))}
                <td className="border px-3 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${row.verdictColor}`}>
                    {row.verdict}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

export function gradeColor(grade: string): string {
  if (grade.startsWith("A")) return "bg-green-100 text-green-800";
  if (grade.startsWith("B")) return "bg-blue-100 text-blue-800";
  if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

export function verdictColor(verdict: string): string {
  if (verdict === "KEEP") return "bg-green-100 text-green-800";
  if (verdict === "INVESTIGATE") return "bg-orange-100 text-orange-800";
  if (verdict === "REPLACE") return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800";
}
