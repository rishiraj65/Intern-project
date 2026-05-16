import { Link } from 'react-router-dom';
import LeadForm from '../components/LeadForm';

export default function SubmitPage() {
  return (
    <div className="py-12 sm:py-16 min-h-[calc(100vh-3.5rem)]">
      <div className="container-narrow">
        <Link
          to="/"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6 inline-block"
        >
          ← Back
        </Link>

        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            Start your business audit
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Fill in the details below. We'll generate and email your report.
          </p>

          <div className="border border-gray-200 rounded-lg p-6">
            <LeadForm />
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center">
            Your data is only used to generate the audit report.
          </p>
        </div>
      </div>
    </div>
  );
}
