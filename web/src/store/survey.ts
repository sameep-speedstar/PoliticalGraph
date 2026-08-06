"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Coords } from "@/data/personalities";
import { questions } from "@/data/questions";
import { getLocalePack, type LocaleId } from "@/data/localePacks";
import {
  applyAdmirationPrior,
  type Answers,
  type AxisConfidence,
} from "@/lib/scoring";
import {
  estimateAdaptive,
  scoreAnswered,
} from "@/lib/adaptive";

type SurveyState = {
  answers: Answers;
  admired: string[];
  locale: LocaleId | null;
  /** 0 = locale, 1 = adaptive Qs, 2 = admire */
  step: number;
  resultCoords: Coords | null;
  rawCoords: Coords | null;
  resultConfidence: AxisConfidence | null;
  questionsAnswered: number;
  setLocale: (locale: LocaleId) => void;
  setAnswer: (id: string, value: number) => void;
  toggleAdmire: (id: string) => void;
  setStep: (step: number) => void;
  activeBank: () => typeof questions;
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
      resultConfidence: null,
      questionsAnswered: 0,
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
      activeBank: () => {
        const locale = get().locale ?? "global";
        const pack = getLocalePack(locale);
        return [...questions, ...pack.questions];
      },
      computeResult: () => {
        const bank = get().activeBank();
        const answers = get().answers;
        const estimate = estimateAdaptive(answers, bank);
        const raw = scoreAnswered(answers, bank);
        const { coords } = applyAdmirationPrior(raw, get().admired);
        const answered = Object.keys(answers).length;
        set({
          rawCoords: raw,
          resultCoords: coords,
          resultConfidence: estimate.confidence,
          questionsAnswered: answered,
        });
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
          resultConfidence: null,
          questionsAnswered: 0,
        }),
    }),
    { name: "poligraph-survey-v3-adaptive" },
  ),
);
