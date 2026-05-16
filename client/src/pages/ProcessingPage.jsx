import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLeadStatus } from '../services/api';
import ProcessingAnimation from '../components/ProcessingAnimation';

export default function ProcessingPage() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!leadId) return;

    let active = true;
    let timer;

    async function poll() {
      try {
        const result = await getLeadStatus(leadId);
        if (!active) return;

        setStatus(result.data);

        if (result.data.status === 'completed') {
          setTimeout(() => navigate(`/success/${leadId}`), 800);
          return;
        }

        if (result.data.status === 'failed') {
          setError(result.data.error || 'Processing failed.');
          return;
        }

        timer = setTimeout(poll, 3000);
      } catch {
        if (active) timer = setTimeout(poll, 5000);
      }
    }

    poll();
    return () => { active = false; clearTimeout(timer); };
  }, [leadId, navigate]);

  const stepMap = { enriching: 0, generating: 1, creating_pdf: 2, emailing: 3, completed: 4 };
  const currentStep = status ? (stepMap[status.status] ?? 0) : 0;

  return (
    <div className="py-16 sm:py-24 min-h-[calc(100vh-3.5rem)]">
      <div className="container-narrow max-w-md mx-auto">
        <h1 className="text-xl font-semibold text-gray-900 mb-1 text-center">
          Generating your report
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          {status?.message || 'Starting…'}
        </p>

        {error ? (
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-700 mb-3">{error}</p>
            <Link to="/submit" className="text-sm text-accent hover:underline">
              ← Try again
            </Link>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4">
            <ProcessingAnimation currentStep={currentStep} />
          </div>
        )}
      </div>
    </div>
  );
}
