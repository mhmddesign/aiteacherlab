"use client";

import React, { useSyncExternalStore } from "react";
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

interface OptionBarChartProps {
  data: OptionTally[];
  height?: number;
  large?: boolean;
}

export function OptionBarChart({ data, height = 300, large = false }: OptionBarChartProps) {
  const isClient = useIsClient();
  const chartData = data.map((item) => ({
    name: large ? item.label : item.shortLabel || item.label,
    fullLabel: item.label,
    count: item.count,
    percentage: item.percentage,
    display: `${item.count} (${item.percentage}%)`,
  }));

  return (
    <div style={{ width: "100%", height }} className="min-h-[220px]">
      {!isClient ? (
        <div className="h-full w-full rounded-xl bg-slate-100/70 animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 64, left: 12, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={large ? 240 : 140}
              tick={{ fill: "#0F172A", fontSize: large ? 15 : 12, fontWeight: 600 }}
            />
            <Tooltip
              formatter={(val, _name, props) => {
                const row = props?.payload as { fullLabel?: string; percentage?: number } | undefined;
                return [`${val ?? 0} réponses (${row?.percentage ?? 0}%)`, row?.fullLabel ?? ""];
              }}
              contentStyle={{
                borderRadius: "12px",
                borderColor: "#CBD5E1",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={large ? 30 : 22}>
              {chartData.map((entry, idx) => (
                <Cell key={entry.name} fill={PALETTE[idx % PALETTE.length]} />
              ))}
              <LabelList
                dataKey="display"
                position="right"
                style={{ fill: "#0F172A", fontSize: large ? 14 : 12, fontWeight: 700 }}
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
  height = 320,
}: ShowcaseGroupedChartProps) {
  const isClient = useIsClient();
  const groups = ["group1", "group2", "group3", "group4"];
  const groupLabels: Record<string, string> = {
    group1: "Groupe 1 (Lecture)",
    group2: "Groupe 2 (Maths)",
    group3: "Groupe 3 (Remédiation)",
    group4: "Groupe 4 (Évaluation)",
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
          <BarChart data={chartData} margin={{ top: 12, right: 20, left: 4, bottom: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fill: "#0F172A", fontSize: 12, fontWeight: 600 }} />
            <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: "12px", borderColor: "#CBD5E1" }} />
            <Legend />
            <Bar dataKey="most_useful" name="Plus utile" fill="#0D9488" radius={[6, 6, 0, 0]} />
            <Bar
              dataKey="best_pedagogy"
              name="Meilleure pédagogie"
              fill="#06B6D4"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="most_creative"
              name="Plus créative"
              fill="#D97706"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
