import React from 'react';
import { Check } from 'lucide-react';

interface BookingStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  maxAccessibleStep: number;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({
  currentStep,
  onStepClick,
  maxAccessibleStep
}) => {
  const steps = [
    { number: 1, label: 'Dates & Guests' },
    { number: 2, label: 'Select Room' },
    { number: 3, label: 'Guest Details' },
    { number: 4, label: 'Review & Pay' },
    { number: 5, label: 'Confirmation' }
  ];

  return (
    <nav aria-label="Booking Progress" className="w-full bg-[#FAF6EE] py-4 border-b border-[#D9C9A8]/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <ol className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isAccessible = step.number <= maxAccessibleStep;

            return (
              <li key={step.number} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1 text-center">
                  <button
                    type="button"
                    disabled={!isAccessible || step.number === 5}
                    onClick={() => onStepClick && isAccessible && onStepClick(step.number)}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-label={`Step ${step.number}: ${step.label}`}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] border text-xs font-mono font-semibold flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-[#A8884B] border-[#A8884B] text-[#FFFDF8] cursor-pointer'
                        : isCurrent
                        ? 'bg-[#5A1F24] border-[#5A1F24] text-[#FAF6EE] ring-2 ring-[#A8884B]/40'
                        : 'bg-[#FFFDF8] border-[#D9C9A8] text-[#2B2B2B]/40 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : step.number}
                  </button>
                  <span
                    className={`mt-1.5 text-[11px] sm:text-xs tracking-wider uppercase hidden sm:block ${
                      isCurrent
                        ? 'text-[#2A1D15] font-semibold'
                        : isCompleted
                        ? 'text-[#8C6F38]'
                        : 'text-[#2B2B2B]/40'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`h-[1px] flex-1 mx-1 sm:mx-2 ${
                      step.number < currentStep ? 'bg-[#A8884B]' : 'bg-[#D9C9A8]/60'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
