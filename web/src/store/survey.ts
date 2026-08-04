"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Coords } from "@/data/personalities";
import {
  applyAdmirationPrior,
  scoreAnswers,
  type Answers,
} from "@/lib/scoring";

type SurveyState = {
  answers: Answers;
  admired: string[];
  step: number;
  resultCoords: Coords | null;
  rawCoords: Coords | null;
  setAnswer: (id: string, value: number) => void;
  toggleAdmire: (id: string) => void;
  setStep: (step: number) => void;
  computeResult: () => Coords;
  reset: () => void;
};

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
      answers: {},
      admired: [],
      step: 0,
      resultCoords: null,
      rawCoords: null,
      setAnswer: (id, value) =>
        set((s) => ({ answers: { ...s.answers, [id]: value } })),
      toggleAdmire: (id) =>
        set((s) => {
          if (id === "none") return { admired: ["none"] };
          const withoutNone = s.admired.filter((x) => x !== "none");
          const exists = withoutNone.includes(id);
          return {
            admired: exists
              ? withoutNone.filter((x) => x !== id)
              : [...withoutNone, id],
          };
        }),
      setStep: (step) => set({ step }),
      computeResult: () => {
        const raw = scoreAnswers(get().answers);
        const { coords } = applyAdmirationPrior(raw, get().admired);
        set({ rawCoords: raw, resultCoords: coords });
        return coords;
      },
      reset: () =>
        set({
          answers: {},
          admired: [],
          step: 0,
          resultCoords: null,
          rawCoords: null,
        }),
    }),
    { name: "politicalgraph-survey-v1" },
  ),
);
