"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  admireOptions,
  questions,
  likertLabels,
} from "@/data/questions";
import {
  getLocalePack,
  localePacks,
  type LocaleId,
} from "@/data/localePacks";
import { useSurveyStore } from "@/store/survey";
import { encodeResultPayload } from "@/lib/scoring";
import { guessLocaleFromBrowser } from "@/lib/geoGuess";
import {
  ADAPTIVE,
  AXIS_KEYS,
  EXPRESS_IDS,
  estimateAdaptive,
  expressQuestions,
  pickNextQuestion,
  confidenceLabel,
  overallConfidence,
} from "@/lib/adaptive";

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

  const [geoHint, setGeoHint] = useState<{
    country: string | null;
    suggestedLocale: LocaleId;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [queue, setQueue] = useState<string[]>([...EXPRESS_IDS]);
  const [qIndex, setQIndex] = useState(0);

  useEffect(() => {
    const guess = guessLocaleFromBrowser();
    setGeoHint({
      country: guess.label,
      suggestedLocale: guess.suggestedLocale,
    });
  }, []);

  // Reset adaptive queue when locale changes (new bank)
  useEffect(() => {
    if (locale == null) return;
    setQueue([...EXPRESS_IDS]);
    setQIndex(0);
  }, [locale]);

  const bank = useMemo(() => {
    const pack = getLocalePack(locale ?? "global");
    return [...questions, ...pack.questions];
  }, [locale]);

  const estimate = useMemo(
    () => estimateAdaptive(answers, bank),
    [answers, bank],
  );

  const isLocaleStep = step === 0;
  const isAdaptiveStep = step === 1;
  const isAdmireStep = step === 2;

  const currentId = isAdaptiveStep ? queue[qIndex] : null;
  const currentQuestion = currentId
    ? bank.find((q) => q.id === currentId) ?? null
    : null;

  const expressCount = expressQuestions(bank).length;
  const answeredCount = Object.keys(answers).length;
  const progress = isLocaleStep
    ? 8
    : isAdmireStep
      ? 92
      : Math.min(85, 12 + (answeredCount / ADAPTIVE.maxCoreItems) * 70);

  const phaseLabel =
    answeredCount < expressCount
      ? "Express map"
      : estimate.done
        ? "Ready"
        : "Refining weak axes";

  const overall = overallConfidence(estimate.confidence);

  function next() {
    if (isLocaleStep) {
      if (locale == null) {
        setError("Choose where we should contextualize current-affairs items.");
        return;
      }
      setError(null);
      setQueue([...EXPRESS_IDS]);
      setQIndex(0);
      setStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (isAdaptiveStep) {
      if (!currentQuestion || answers[currentQuestion.id] == null) {
        setError("Pick a response to continue.");
        return;
      }
      setError(null);

      const nextAnswers = {
        ...answers,
        [currentQuestion.id]: answers[currentQuestion.id]!,
      };
      const nextEstimate = estimateAdaptive(nextAnswers, bank);

      // More items already in queue ahead of us
      if (qIndex + 1 < queue.length) {
        setQIndex(qIndex + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (!nextEstimate.done) {
        const pick = pickNextQuestion(nextAnswers, bank, nextEstimate);
        if (pick && !queue.includes(pick.id)) {
          setQueue((q) => [...q, pick.id]);
          setQIndex(qIndex + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }

      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (isAdmireStep) {
      if (admired.length === 0) {
        setError("Pick at least one option (including “prefer not to say”).");
        return;
      }
      setError(null);
      const coords = computeResult();
      const est = estimateAdaptive(answers, bank);
      const token = encodeResultPayload({
        coords,
        admired,
        confidence: est.confidence,
        questionsAnswered: Object.keys(answers).length,
      });
      router.push(`/results?r=${token}`);
    }
  }

  function back() {
    setError(null);
    if (isAdmireStep) {
      setStep(1);
      setQIndex(Math.max(0, queue.length - 1));
      return;
    }
    if (isAdaptiveStep) {
      if (qIndex > 0) {
        setQIndex(qIndex - 1);
        return;
      }
      setStep(0);
    }
  }

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
            Then an <strong>adaptive</strong> survey asks as few questions as
            needed — usually 6–12 — stopping when each axis is confident enough.
            Same fixed 3D basis for everyone. No account needed.
          </p>
          {geoHint?.suggestedLocale && geoHint.suggestedLocale !== "global" && (
            <p className="geo-hint">
              Browser hint suggests pack{" "}
              <strong>{geoHint.suggestedLocale}</strong> ({geoHint.country}).
              Confirm or change below.
              {locale == null && (
                <>
                  {" "}
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setLocale(geoHint.suggestedLocale)}
                  >
                    Use suggested pack
                  </button>
                </>
              )}
            </p>
          )}
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
                    ? `May add up to ${p.questions.length} local refine items`
                    : "Core adaptive path only"}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {isAdaptiveStep && currentQuestion && (
        <>
          <p className="survey-section-label">
            {phaseLabel} · Question {qIndex + 1}
            {queue.length > expressCount ? ` of ~${queue.length}+` : ` of ${expressCount}+`}
            {" · "}
            {currentQuestion.axis}
          </p>
          <h1>
            {answeredCount < expressCount ? "Quick read" : "Sharpening your map"}
          </h1>
          <p className="blurb">
            {answeredCount < expressCount
              ? "Six core value questions first. We only add more where your answers are still fuzzy."
              : `Refining ${estimate.openAxes.join(", ") || "final checks"}. Confidence ${overall}% (${confidenceLabel(overall)}).`}
          </p>

          <div className="confidence-strip" aria-label="Axis confidence">
            {AXIS_KEYS.map((axis) => (
              <div key={axis} className="confidence-strip-item">
                <span>{axis}</span>
                <div className="confidence-bar">
                  <i style={{ width: `${estimate.confidence[axis]}%` }} />
                </div>
                <em>{estimate.confidence[axis]}%</em>
              </div>
            ))}
          </div>

          <fieldset className="question adaptive-question">
            <legend>
              <p>{currentQuestion.text}</p>
            </legend>
            <div
              className="likert"
              role="radiogroup"
              aria-label={currentQuestion.text}
            >
              {likertLabels.map((label, i) => {
                const value = i + 1;
                return (
                  <label key={label}>
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={value}
                      checked={answers[currentQuestion.id] === value}
                      onChange={() => setAnswer(currentQuestion.id, value)}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </>
      )}

      {isAdaptiveStep && !currentQuestion && (
        <>
          <h1>Map ready</h1>
          <p className="blurb">
            Adaptive path complete ({answeredCount} questions, {overall}%{" "}
            confidence). Continue to the optional admiration step.
          </p>
        </>
      )}

      {isAdmireStep && (
        <>
          <p className="survey-section-label">Final step · Ideal person</p>
          <h1>Who do you admire or feel aligned with?</h1>
          <p className="blurb">
            Soft signal only (≤12% blend). Your adaptive answers still dominate.
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
          disabled={isLocaleStep}
          style={{ opacity: isLocaleStep ? 0.4 : 1 }}
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
