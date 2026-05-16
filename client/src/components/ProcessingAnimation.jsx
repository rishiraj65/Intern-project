const STEPS = [
  'Analyzing website',
  'Generating AI report',
  'Creating PDF',
  'Sending email',
  'Complete',
];

export default function ProcessingAnimation({ currentStep }) {
  return (
    <div className="space-y-1">
      {STEPS.map((label, index) => {
        const isDone = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div
            key={label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive ? 'bg-accent-light' : ''
            }`}
          >
            {/* Status indicator */}
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              {isDone ? (
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : isActive ? (
                <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-300" />
              )}
            </div>

            <span
              className={`${
                isDone ? 'text-gray-500' : isActive ? 'text-gray-900 font-medium' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
