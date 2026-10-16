import { describe, it, expect } from "vitest";
import {
  scheduleNext, buildPlan, dailyTasks, masteryScore, heatmapClass,
  gapIndices, maskIndices, daysBetween, qualityFor,
} from "./hifzEngine";

describe("scheduleNext", () => {
  it("fails low-confidence and resets interval", () => {
    const item = { ef: 2.5, intervalDays: 10, reps: 3, dueDate: "2026-01-01" };
    const next = scheduleNext(item, 1, "2026-01-01");
    expect(next.reps).toBe(0);
    expect(next.intervalDays).toBe(1);
    expect(next.dueDate).toBe("2026-01-02");
  });

  it("graduates 1 → 6 → interval*ef days", () => {
    const base = { ef: 2.5, intervalDays: 0, reps: 0, dueDate: "2026-01-01" };
    const s1 = scheduleNext(base, 5, "2026-01-01");
    expect(s1.reps).toBe(1);
    expect(s1.intervalDays).toBe(1);
    const s2 = scheduleNext(s1, 5, "2026-01-02");
    expect(s2.intervalDays).toBe(6);
    const s3 = scheduleNext(s2, 5, "2026-01-08");
    expect(s3.intervalDays).toBe(15); // 6 * 2.6
  });

  it("caps ef at 3.0", () => {
    let item = { ef: 2.9, intervalDays: 6, reps: 2, dueDate: "2026-01-01" };
    for (let i = 0; i < 20; i++) item = scheduleNext(item, 5, item.dueDate);
    expect(item.ef).toBeLessThanOrEqual(3.0);
  });
});

describe("buildPlan", () => {
  it("splits ayahs into daily portions", () => {
    const plan = buildPlan({ totalAyahs: 10, dailyAyahs: 3, startDate: "2026-01-01" });
    expect(plan.items.length).toBe(4);
    expect(plan.items[0]).toMatchObject({ fromAyah: 1, toAyah: 3, count: 3 });
    expect(plan.items[3]).toMatchObject({ fromAyah: 10, toAyah: 10, count: 1 });
    expect(plan.endDate).toBe("2026-01-04");
  });

  it("handles empty plan", () => {
    expect(buildPlan({ totalAyahs: 0, dailyAyahs: 5 }).items).toEqual([]);
  });
});

describe("dailyTasks", () => {
  it("splits sabaq/sabqi/manzil", () => {
    const plan = buildPlan({ totalAyahs: 30, dailyAyahs: 1, startDate: "2026-01-01" });
    // mark first 3 as memorized with staggered due dates
    plan.items[0].reps = 1; plan.items[0].dueDate = "2026-01-05";
    plan.items[1].reps = 1; plan.items[1].dueDate = "2026-01-06";
    plan.items[2].reps = 1; plan.items[2].dueDate = "2026-02-01";
    const t = dailyTasks(plan, "2026-01-06");
    expect(t.sabaq).toEqual([plan.items[1]]);
    expect(t.sabqi.map((i) => i.fromAyah)).toEqual([2, 1]);
    expect(t.manzil.map((i) => i.fromAyah)).toEqual([3]);
  });
});

describe("masteryScore & heatmapClass", () => {
  it("scores 0 for unmemorized", () => {
    expect(masteryScore({ reps: 0 })).toBe(0);
    expect(heatmapClass(0)).toContain("bg-white/10");
  });
  it("decays overdue items", () => {
    const s = masteryScore({ reps: 2, lastConfidence: 5, dueDate: "2026-01-01" }, "2026-01-05");
    expect(s).toBeLessThan(100);
    expect(s).toBeGreaterThanOrEqual(0);
  });
});

describe("test-mode helpers", () => {
  it("maskIndices scales with level", () => {
    expect(maskIndices(10, 0)).toEqual([]);
    expect(maskIndices(10, 0.5).length).toBe(5);
    expect(maskIndices(10, 1).length).toBe(10);
  });
  it("gapIndices gives requested gaps", () => {
    const g = gapIndices(20, 4);
    expect(g.length).toBe(4);
    expect(Math.max(...g)).toBeLessThan(20);
  });
});

describe("utils", () => {
  it("daysBetween", () => {
    expect(daysBetween("2026-01-01", "2026-01-08")).toBe(7);
  });
  it("qualityFor", () => {
    expect(qualityFor(5)).toBe(5.0);
    expect(qualityFor(2)).toBe(2.0);
  });
});
