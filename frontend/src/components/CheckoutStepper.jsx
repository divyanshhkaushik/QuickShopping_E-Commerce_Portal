const steps = ["Checkout", "Address", "Payment"];

function CheckoutStepper({ currentStep }) {
  const progressWidth = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="mb-10">
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-10 right-10 top-6 h-1 rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="relative grid grid-cols-3 gap-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isFuture = index > currentStep;

            return (
              <div key={step} className="flex flex-col items-center text-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-4 text-base font-bold transition-all duration-300 ${
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                      : isCurrent
                        ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "border-slate-200 bg-slate-100 text-slate-500"
                  }`}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>

                <span
                  className={`mt-3 text-sm font-semibold transition-colors duration-300 ${
                    isCompleted
                      ? "text-emerald-600"
                      : isCurrent
                        ? "text-blue-600"
                        : "text-slate-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CheckoutStepper;
