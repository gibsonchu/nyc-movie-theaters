"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Theater } from "@/types/theater";
import type { CurrentZoningTheaterProperties } from "@/types/current-zoning";
import { DEFAULT_YEAR, clampYear, MAX_YEAR, MIN_YEAR, PLAY_INTERVAL_MS } from "@/lib/timeline";

interface TimelineContextValue {
  year: number;
  setYear: (year: number) => void;
  playing: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  zoningVisible: boolean;
  toggleZoning: () => void;
  selectedTheater: Theater | null;
  selectTheater: (theater: Theater | null) => void;
  /** The present-day "where could a theater open" screening — mutually exclusive with the historical zoning toggle. */
  currentZoningMode: boolean;
  toggleCurrentZoningMode: () => void;
  selectedZoningTheater: CurrentZoningTheaterProperties | null;
  selectZoningTheater: (theater: CurrentZoningTheaterProperties | null) => void;
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const [year, setYearState] = useState(DEFAULT_YEAR);
  const [playing, setPlaying] = useState(false);
  const [zoningVisible, setZoningVisible] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [currentZoningMode, setCurrentZoningMode] = useState(false);
  const [selectedZoningTheater, setSelectedZoningTheater] = useState<CurrentZoningTheaterProperties | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setYear = useCallback((next: number) => {
    setYearState(clampYear(next));
  }, []);

  const pause = useCallback(() => setPlaying(false), []);
  const play = useCallback(() => setPlaying(true), []);
  const togglePlay = useCallback(() => setPlaying((prev) => !prev), []);
  const toggleZoning = useCallback(() => {
    setZoningVisible((prev) => !prev);
    setCurrentZoningMode(false);
  }, []);
  const selectTheater = useCallback((theater: Theater | null) => setSelectedTheater(theater), []);
  const toggleCurrentZoningMode = useCallback(() => {
    setCurrentZoningMode((prev) => !prev);
    setZoningVisible(false);
    setSelectedZoningTheater(null);
  }, []);
  const selectZoningTheater = useCallback(
    (theater: CurrentZoningTheaterProperties | null) => setSelectedZoningTheater(theater),
    []
  );

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setYearState((prev) => {
        if (prev >= MAX_YEAR) {
          return MIN_YEAR;
        }
        return prev + 1;
      });
    }, PLAY_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const value = useMemo(
    () => ({
      year,
      setYear,
      playing,
      play,
      pause,
      togglePlay,
      zoningVisible,
      toggleZoning,
      selectedTheater,
      selectTheater,
      currentZoningMode,
      toggleCurrentZoningMode,
      selectedZoningTheater,
      selectZoningTheater,
    }),
    [
      year,
      setYear,
      playing,
      play,
      pause,
      togglePlay,
      zoningVisible,
      toggleZoning,
      selectedTheater,
      selectTheater,
      currentZoningMode,
      toggleCurrentZoningMode,
      selectedZoningTheater,
      selectZoningTheater,
    ]
  );

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
}

export function useTimeline(): TimelineContextValue {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error("useTimeline must be used within TimelineProvider");
  return ctx;
}
