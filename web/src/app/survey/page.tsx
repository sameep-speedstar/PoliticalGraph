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
import { useSurveyStore } from "@/store/survey";
import { encodeResultPayload } from "@/lib/scoring";

const SECTIONS: Question["section"][] = ["politics", "society", "religion"];

export default function SurveyPage() {
  const router = useRouter();
  const {
    answers,
    admired,
    step,
    setAnswer,
    toggleAdmire,
    setStep,
    computeResult,
  } = useSurveyStore();

  const totalSteps = SECTIONS.length + 1; // + admire step
  const isAdmireStep = step >= SECTIONS.length;

  const sectionQuestions = useMemo(() => {
    if (isAdmireStep) return [];
    const section = SECTIONS[step];
    return questions.filter((q) => q.section === section);
  }, [step, isAdmireStep]);

  const progress = ((step + 1) / totalSteps) * 100;

  const sectionComplete = isAdmireStep
    ? admired.length > 0
    : sectionQuestions.every((q) => answers[q.id] != null);

  const [error, setError] = useState<string | null>(null);

  function next() {
    if (!sectionComplete) {
      setError(
        isAdmireStep
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

  const meta = !isAdmireStep ? sectionMeta[SECTIONS[step]] : null;

  return (
    <div className="survey-shell">
      <div className="progress" aria-hidden>
        <span style={{ width: `${progress}%` }} />
      </div>

      {!isAdmireStep && meta ? (
        <>
          <p className="survey-section-label">
            Section {step + 1} of {SECTIONS.length} · {meta.title}
          </p>
          <h1>{meta.title}</h1>
          <p className="blurb">{meta.blurb} Agree or disagree with each statement.</p>
          <div className="question-stack">
            {sectionQuestions.map((q) => (
              <fieldset key={q.id} className="question">
                <legend>
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
            ))}
          </div>
        </>
      ) : (
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
