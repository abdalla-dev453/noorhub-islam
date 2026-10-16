import { describe, it, expect } from "vitest";
import {
  computePrayerTimes,
  nextPrayer,
  qiblaDirection,
  formatPrayerTime,
} from "./prayerTimes";

describe("prayer times", () => {
  const nairobi = { lat: -1.286389, lng: 36.817223, tz: 3 };

  it("returns all six times", () => {
    const t = computePrayerTimes(
      new Date(2026, 0, 1),
      nairobi.lat,
      nairobi.lng,
      nairobi.tz,
    );
    for (const k of ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"]) {
      expect(t[k]).toEqual(
        expect.objectContaining({
          h: expect.any(Number),
          m: expect.any(Number),
        }),
      );
      expect(t[k].h).toBeGreaterThanOrEqual(0);
      expect(t[k].h).toBeLessThan(24);
      expect(t[k].m).toBeGreaterThanOrEqual(0);
      expect(t[k].m).toBeLessThan(60);
    }
  });

  it("times are in sensible order", () => {
    const t = computePrayerTimes(
      new Date(2026, 5, 21),
      nairobi.lat,
      nairobi.lng,
      nairobi.tz,
    );
    const h = (x) => x.h + x.m / 60;
    expect(h(t.fajr)).toBeLessThan(h(t.sunrise));
    expect(h(t.sunrise)).toBeLessThan(h(t.dhuhr));
    expect(h(t.dhuhr)).toBeLessThan(h(t.asr));
    expect(h(t.asr)).toBeLessThan(h(t.maghrib));
    expect(h(t.maghrib)).toBeLessThan(h(t.isha));
  });

  it("Hanafi asr is later than standard asr", () => {
    const t1 = computePrayerTimes(
      new Date(2026, 0, 1),
      nairobi.lat,
      nairobi.lng,
      nairobi.tz,
      "MWL",
      "STANDARD",
    );
    const t2 = computePrayerTimes(
      new Date(2026, 0, 1),
      nairobi.lat,
      nairobi.lng,
      nairobi.tz,
      "MWL",
      "HANAFI",
    );
    expect(t2.asr.h * 60 + t2.asr.m).toBeGreaterThan(t1.asr.h * 60 + t1.asr.m);
  });

  it("Umm al-Qura isha is maghrib + 90 min", () => {
    const t = computePrayerTimes(
      new Date(2026, 0, 1),
      21.4225,
      39.8262,
      3,
      "UMM_AL_QURA",
    );
    const diff = t.isha.h * 60 + t.isha.m - (t.maghrib.h * 60 + t.maghrib.m);
    expect(diff).toBe(90);
  });

  it("dhuhr near solar noon", () => {
    const t = computePrayerTimes(new Date(2026, 0, 1), 0, 0, 0);
    expect(Math.abs(t.dhuhr.h + t.dhuhr.m / 60 - 12)).toBeLessThan(0.25);
  });

  it("applies manual adjustments", () => {
    const base = computePrayerTimes(
      new Date(2026, 0, 1),
      nairobi.lat,
      nairobi.lng,
      nairobi.tz,
    );
    const adj = computePrayerTimes(
      new Date(2026, 0, 1),
      nairobi.lat,
      nairobi.lng,
      nairobi.tz,
      "MWL",
      "STANDARD",
      { fajr: 10 },
    );
    const diff =
      adj.fajr.h * 60 + adj.fajr.m - (base.fajr.h * 60 + base.fajr.m);
    expect(diff).toBe(10);
  });

  it("nextPrayer picks the correct upcoming prayer", () => {
    const t = computePrayerTimes(
      new Date(2026, 0, 1),
      nairobi.lat,
      nairobi.lng,
      nairobi.tz,
    );
    const noon = new Date(2026, 0, 1, 12, 0);
    const n = nextPrayer(t, noon);
    expect(n.key).toBe("dhuhr");
    expect(n.tomorrow).toBe(false);
    const late = new Date(2026, 0, 1, 23, 0);
    expect(nextPrayer(t, late).tomorrow).toBe(true);
  });
});

describe("qibla", () => {
  it("Makkah to itself ~0 bearing from Kaaba is degenerate; Nairobi should point NNE", () => {
    const b = qiblaDirection(-1.286389, 36.817223);
    expect(b).toBeGreaterThan(0);
    expect(b).toBeLessThan(90);
  });

  it("Lagos qibla is roughly north", () => {
    const b = qiblaDirection(6.4531, 3.3958);
    expect(b).toBeGreaterThanOrEqual(0);
    expect(b).toBeLessThan(70);
  });
});

describe("formatting", () => {
  it("pads times", () => {
    expect(formatPrayerTime({ h: 5, m: 3 })).toBe("05:03");
    expect(formatPrayerTime({ h: 23, m: 45 })).toBe("23:45");
  });
});
