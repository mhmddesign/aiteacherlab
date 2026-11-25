"use client";

import React, { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { OptionTally, ShowcaseCategoryTally } from "@/content/types";

const PALETTE = ["#0D9488", "#06B6D4", "#1E3A8A", "#D97706", "#0F766E", "#0284C7"];
const emptySubscribe = () => () => {};

function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

interface BilingualTickPayload {
  value: string;
}

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: BilingualTickPayload;
  large?: boolean;
  labelMap: Map<string, { fr: string; ar: string }>;
}

function BilingualYAxisTick({
  x = 0,
  y = 0,
  payload,
  large = false,
  labelMap,
}: CustomTickProps) {
  const key = payload?.value ?? "";
  const entry = labelMap.get(key) ?? { fr: key, ar: "" };
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-8}
        y={-5}
        textAnchor="end"
        fill="#0F172A"
        fontSize={large ? 13 : 11}
        fontWeight={700}
      >
        {entry.fr}
      </text>
      {entry.ar && (
        <text
          x={-8}
          y={11}
          textAnchor="end"
          fill="#0F766E"
          fontSize={large ? 12 : 10}
          fontWeight={600}
          className="font-arabic"
        >
          {entry.ar}
        </text>
      )}
    </g>
  );
}

interface OptionBarChartProps {
  data: OptionTally[];
  height?: number;
  large?: boolean;
}

export function OptionBarChart({ data, height = 300, large = false }: OptionBarChartProps) {
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const labelMap = new Map<string, { fr: string; ar: string }>();

  const chartData = data.map((item) => {
    const fr = large ? item.label.fr : item.shortLabel.fr || item.label.fr;
    const ar = large ? item.label.ar : item.shortLabel.ar || item.label.ar;
    labelMap.set(item.optionId, { fr, ar });
    return {
      optionId: item.optionId,
      fullLabel: `${item.label.fr} · ${item.label.ar}`,
      count: item.count,
      percentage: item.percentage,
      display: `${item.count} (${item.percentage}%)`,
    };
  });

  const computedHeight = Math.max(height, data.length * (large ? 64 : 52));

  return (
    <div style={{ width: "100%", height: computedHeight }} className="min-h-[220px]">
      {!isClient ? (
        <div className="h-full w-full rounded-xl bg-slate-100/70 animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 68, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="optionId"
              width={large ? 275 : 170}
              interval={0}
              tick={<BilingualYAxisTick large={large} labelMap={labelMap} />}
            />
            <Tooltip
              formatter={(val, _name, props) => {
                const row = props?.payload as
                  | { fullLabel?: string; percentage?: number }
                  | undefined;
                return [
                  `${val ?? 0} réponses / إجابة (${row?.percentage ?? 0}%)`,
                  row?.fullLabel ?? "",
                ];
              }}
              contentStyle={{
                borderRadius: "12px",
                borderColor: "#CBD5E1",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="count"
              radius={[0, 8, 8, 0]}
              barSize={large ? 28 : 22}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={320}
            >
              {chartData.map((entry, idx) => (
                <Cell key={entry.optionId} fill={PALETTE[idx % PALETTE.length]} />
              ))}
              <LabelList
                dataKey="display"
                position="right"
                style={{ fill: "#0F172A", fontSize: large ? 13 : 11, fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

interface ShowcaseGroupedChartProps {
  tallies: ShowcaseCategoryTally[];
  height?: number;
}

export function ShowcaseGroupedChart({
  tallies,
  height = 330,
}: ShowcaseGroupedChartProps) {
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const groups = ["group1", "group2", "group3", "group4"];
  const groupLabels: Record<string, string> = {
    group1: "G1 · Lecture / القراءة",
    group2: "G2 · Maths / الرياضيات",
    group3: "G3 · Remédiation / الدعم",
    group4: "G4 · Évaluation / التقويم",
  };

  const chartData = groups.map((gid) => {
    const row: Record<string, string | number> = { name: groupLabels[gid] };
    for (const cat of tallies) {
      const opt = cat.options.find((o) => o.optionId === gid);
      row[cat.categoryId] = opt?.count ?? 0;
    }
    return row;
  });

  return (
    <div style={{ width: "100%", height }} className="min-h-[240px]">
      {!isClient ? (
        <div className="h-full w-full rounded-xl bg-slate-100/70 animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 12, right: 16, left: 4, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#0F172A", fontSize: 11, fontWeight: 600 }}
              interval={0}
            />
            <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: "12px", borderColor: "#CBD5E1" }} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar
              dataKey="most_useful"
              name="Plus utile · الأكثر فائدة"
              fill="#0D9488"
              radius={[6, 6, 0, 0]}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={320}
            />
            <Bar
              dataKey="best_pedagogy"
              name="Meilleure pédagogie · أفضل بيداغوجيا"
              fill="#06B6D4"
              radius={[6, 6, 0, 0]}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={320}
            />
            <Bar
              dataKey="most_creative"
              name="Plus créative · الأكثر إبداعاً"
              fill="#D97706"
              radius={[6, 6, 0, 0]}
              isAnimationActive={!prefersReducedMotion}
              animationDuration={320}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
