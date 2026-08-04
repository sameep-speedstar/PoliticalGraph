"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  admireOptions,
  questions,
  sectionMeta,
  likertLabels,
  type Question,
} from "@/data/questions";
import { getLocalePack, localePacks } from "@/data/localePacks";
import { useSurveyStore } from "@/store/survey";
import { encodeResultPayload } from "@/lib/scoring";

const SECTIONS: Question["section"][] = ["politics", "society", "religion"];

export default function SurveyPage() {
  const router = useRouter();
  const {
    answers,
    admired,
    locale,
    step,
    setLocale,
    setAnswer,
    toggleAdmire,
    setStep,
    computeResult,
  } = useSurveyStore();

  // step 0 = locale, 1..3 = sections, last = admire
  const sectionOffset = 1;
  const totalSteps = sectionOffset + SECTIONS.length + 1;
  const isLocaleStep = step === 0;
  const isAdmireStep = step === totalSteps - 1;
  const sectionIndex = step - sectionOffset;
  const isSectionStep = !isLocaleStep && !isAdmireStep;

  const pack = getLocalePack(locale ?? "global");

  const activeBank = useMemo(() => {
    return [...questions, ...pack.questions];
  }, [pack]);

  const sectionQuestions = useMemo(() => {
    if (!isSectionStep) return [];
    const section = SECTIONS[sectionIndex];
    return activeBank.filter((q) => q.section === section);
  }, [isSectionStep, sectionIndex, activeBank]);

  const progress = ((step + 1) / totalSteps) * 100;

  const sectionComplete = isLocaleStep
    ? locale != null
    : isAdmireStep
      ? admired.length > 0
      : sectionQuestions.every((q) => answers[q.id] != null);

  const [error, setError] = useState<string | null>(null);

  function next() {
    if (!sectionComplete) {
      setError(
        isLocaleStep
          ? "Choose where we should contextualize current-affairs items."
          : isAdmireStep
            ? "Pick at least one option (including “prefer not to say”)."
            : "Answer every statement in this section to continue.",
      );
      return;
    }
    setError(null);
    if (step < totalSteps - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const coords = computeResult();
    const token = encodeResultPayload({ coords, admired });
    router.push(`/results?r=${token}`);
  }

  function back() {
    setError(null);
    if (step > 0) setStep(step - 1);
  }

  const meta = isSectionStep ? sectionMeta[SECTIONS[sectionIndex]] : null;
  const contextualCount = sectionQuestions.filter((q) =>
    pack.questions.some((pq) => pq.id === q.id),
  ).length;

  return (
    <div className="survey-shell">
      <div className="progress" aria-hidden>
        <span style={{ width: `${progress}%` }} />
      </div>

      {isLocaleStep && (
        <>
          <p className="survey-section-label">Step 1 · Context</p>
          <h1>Where should we situate your map?</h1>
          <p className="blurb">
            Core value questions are global. Location adds regional framing and a
            rotating current-affairs pack — still scored onto the{" "}
            <strong>same fixed 3D axes</strong> used for every comparison.
          </p>
          <div className="admire-grid">
            {localePacks.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`admire-chip ${locale === p.id ? "is-on" : ""}`}
                onClick={() => setLocale(p.id)}
              >
                <strong style={{ display: "block" }}>{p.label}</strong>
                <span style={{ fontSize: "0.78rem", color: "var(--ink-soft)" }}>
                  {p.questions.length
                    ? `${p.questions.length} contextual items · as of ${p.affairsAsOf}`
                    : "Core values only"}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {isSectionStep && meta && (
        <>
          <p className="survey-section-label">
            {pack.label} · {meta.title}
            {contextualCount > 0
              ? ` · ${contextualCount} location / affairs item${contextualCount > 1 ? "s" : ""}`
              : ""}
          </p>
          <h1>{meta.title}</h1>
          <p className="blurb">
            {meta.blurb} Agree or disagree with each statement. Party names are
            avoided on purpose.
          </p>
          <div className="question-stack">
            {sectionQuestions.map((q) => {
              const isContextual = pack.questions.some((pq) => pq.id === q.id);
              return (
                <fieldset key={q.id} className="question">
                  <legend>
                    {isContextual && (
                      <span className="survey-section-label">
                        Location / current affairs
                      </span>
                    )}
                    <p>{q.text}</p>
                  </legend>
                  <div className="likert" role="radiogroup" aria-label={q.text}>
                    {likertLabels.map((label, i) => {
                      const value = i + 1;
                      return (
                        <label key={label}>
                          <input
                            type="radio"
                            name={q.id}
                            value={value}
                            checked={answers[q.id] === value}
                            onChange={() => setAnswer(q.id, value)}
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </>
      )}

      {isAdmireStep && (
        <>
          <p className="survey-section-label">Final step · Ideal person</p>
          <h1>Who do you admire or feel aligned with?</h1>
          <p className="blurb">
            Optional soft signal only — it nudges your position slightly toward
            people you pick (capped at 12%). Your answers still dominate.
          </p>
          <div className="admire-grid">
            {admireOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`admire-chip ${admired.includes(opt.id) ? "is-on" : ""}`}
                onClick={() => toggleAdmire(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}

      {error && (
        <p style={{ color: "var(--copper-deep)", marginTop: "1rem" }} role="alert">
          {error}
        </p>
      )}

      <div className="survey-nav">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={back}
          disabled={step === 0}
          style={{ opacity: step === 0 ? 0.4 : 1 }}
        >
          Back
        </button>
        <button type="button" className="btn btn-primary" onClick={next}>
          {isAdmireStep ? "See my map" : "Continue"}
        </button>
      </div>
    </div>
  );
}
