interface Step {
  number: number;
  title: string;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
}

const Stepper = ({ currentStep, steps }: StepperProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-6 right-0 left-0 h-0.5 bg-border -z-10" />

        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          return (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : isCompleted
                    ? "bg-primary/20 text-primary border-primary"
                    : "bg-background text-muted-foreground border-border"
                }`}
              >
                {isCompleted ? "✓" : step.number}
              </div>
              <span
                className={`text-sm mt-2 text-center ${
                  isActive ? "text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
