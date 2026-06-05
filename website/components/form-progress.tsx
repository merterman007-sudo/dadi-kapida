type FormProgressProps = {
  steps: string[];
  current: number;
  completedSteps: Set<number>;
  onGoTo: (index: number) => void;
};

export function FormProgress({ steps, current, completedSteps, onGoTo }: FormProgressProps) {
  return (
    <div className="mb-8">
      {/* Bar */}
      <div className="relative mb-4 h-1 w-full rounded-full bg-line">
        <div
          className="absolute left-0 top-0 h-1 rounded-full bg-gradient-to-r from-trust to-gold transition-all duration-500"
          style={{ width: `${((current + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="flex items-start justify-between">
        {steps.map((label, index) => {
          const isDone = completedSteps.has(index);
          const isActive = current === index;
          const isClickable = index <= current || isDone;

          return (
            <button
              key={label}
              type="button"
              onClick={() => isClickable && onGoTo(index)}
              disabled={!isClickable}
              className={`flex flex-col items-center gap-1.5 text-center transition ${
                isClickable ? "cursor-pointer" : "cursor-not-allowed"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold transition
                  ${isActive ? "border-navy bg-navy text-white" : ""}
                  ${isDone && !isActive ? "border-trust bg-trust text-white" : ""}
                  ${!isActive && !isDone ? "border-line bg-white text-muted/40" : ""}
                `}
              >
                {isDone && !isActive ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l2.5 2.5 5.5-5.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`hidden text-[10px] font-medium sm:block leading-tight max-w-[60px] ${
                  isActive ? "text-navy" : isDone ? "text-trust" : "text-muted/40"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile current step */}
      <p className="mt-2 text-center text-xs font-medium text-muted sm:hidden">
        {current + 1} / {steps.length} — {steps[current]}
      </p>
    </div>
  );
}
