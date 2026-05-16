export default function SuccessAnimation() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
}
