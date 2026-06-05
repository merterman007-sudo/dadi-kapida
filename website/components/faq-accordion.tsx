"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {faqs.map((item, index) => (
        <div
          key={item.question}
          className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
            open === index ? "border-gold/40 bg-white shadow-soft" : "border-line bg-white/70"
          }`}
        >
          <button
            type="button"
            onClick={() => setOpen(open === index ? null : index)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
            aria-expanded={open === index}
          >
            <span className="pr-4 text-sm font-semibold text-navy">{item.question}</span>
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                open === index ? "border-gold/50 bg-gold/15 text-gold" : "border-line bg-ivory text-muted"
              }`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform duration-200 ${open === index ? "rotate-180" : ""}`}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          {open === index ? (
            <div className="px-5 pb-5">
              <p className="text-sm leading-7 text-muted">{item.answer}</p>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
