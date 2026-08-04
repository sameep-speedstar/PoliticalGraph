"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Coords } from "@/data/personalities";
import { questions } from "@/data/questions";
import { getLocalePack, type LocaleId } from "@/data/localePacks";
import {
  applyAdmirationPrior,
  scoreAnswers,
  type Answers,
} from "@/lib/scoring";

type SurveyState = {
  answers: Answers;
  admired: string[];
  locale: LocaleId | null;
  step: number;
  resultCoords: Coords | null;
  rawCoords: Coords | null;
  setLocale: (locale: LocaleId) => void;
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
      locale: null,
      step: 0,
      resultCoords: null,
      rawCoords: null,
      setLocale: (locale) => set({ locale }),
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
        const locale = get().locale ?? "global";
        const pack = getLocalePack(locale);
        const bank = [...questions, ...pack.questions];
        const raw = scoreAnswers(get().answers, bank);
        const { coords } = applyAdmirationPrior(raw, get().admired);
        set({ rawCoords: raw, resultCoords: coords });
        return coords;
      },
      reset: () =>
        set({
          answers: {},
          admired: [],
          locale: null,
          step: 0,
          resultCoords: null,
          rawCoords: null,
        }),
    }),
    { name: "poligraph-survey-v2" },
  ),
);
