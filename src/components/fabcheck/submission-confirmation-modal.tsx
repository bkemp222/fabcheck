"use client";

import { useEffect, useRef } from "react";

type SubmissionConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onReturnHome: () => void;
};

export function SubmissionConfirmationModal({
  isOpen,
  onClose,
  onReturnHome,
}: SubmissionConfirmationModalProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.setTimeout(() => buttonRef.current?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab") {
        event.preventDefault();
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function handleReturnHome() {
    onClose();
    onReturnHome();
  }

  return (
    <div
      className="submission-modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-md"
      style={{
        paddingTop: "max(1.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
      }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-confirmation-title"
        aria-describedby="submission-confirmation-description"
        className="submission-modal-panel max-h-full w-full max-w-[520px] overflow-y-auto rounded-[18px] border-2 border-[#FFA431] bg-black px-6 py-7 text-center text-white shadow-2xl outline-none sm:px-10 sm:py-9"
      >
        <img
          src="/images/branding/fabcheck-logo.svg"
          alt="FabCheck"
          className="mx-auto h-auto w-40 sm:w-48"
        />

        <div className="mt-7 flex justify-center">
          <svg
            className="submission-checkmark h-20 w-20 sm:h-24 sm:w-24"
            viewBox="0 0 96 96"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="submission-checkmark-circle"
              cx="48"
              cy="48"
              r="34"
              stroke="#FFA431"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              className="submission-checkmark-check"
              d="M32 49.5L43.5 61L65 37.5"
              stroke="#FFA431"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2
          id="submission-confirmation-title"
          className="mt-5 text-2xl font-black uppercase italic tracking-tight text-[#FFA431] sm:text-3xl"
        >
          Submission Received
        </h2>

        <div
          id="submission-confirmation-description"
          className="mx-auto mt-4 max-w-sm space-y-2 text-sm leading-6 text-white/80 sm:text-base"
        >
          <p>Your FabCheck has been successfully submitted.</p>
          <p>
            Our team will review your project details and reach out with any
            questions.
          </p>
          <p className="font-bold text-white">
            You can expect your formal estimate within 1–2 business days.
          </p>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleReturnHome}
          className="mt-7 min-h-11 w-full rounded-xl bg-[#FFA431] px-6 py-3 text-sm font-black uppercase italic tracking-wide text-black shadow-sm transition duration-150 hover:bg-[#ffb95a] focus:outline-none focus:ring-4 focus:ring-[#FFA431]/35 focus:ring-offset-2 focus:ring-offset-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-44"
        >
          Return Home
        </button>
      </section>
    </div>
  );
}
