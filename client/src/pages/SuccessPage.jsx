import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLeadById } from '../services/api';
import SuccessAnimation from '../components/SuccessAnimation';

export default function SuccessPage() {
  const { leadId } = useParams();
  const [lead, setLead] = useState(null);

  useEffect(() => {
    if (!leadId) return;
    getLeadById(leadId)
      .then((res) => setLead(res.data))
      .catch(() => {});
  }, [leadId]);

  return (
    <div className="py-16 sm:py-24 min-h-[calc(100vh-3.5rem)]">
      <div className="container-narrow max-w-md mx-auto text-center">
        <div className="mb-5">
          <SuccessAnimation />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Report delivered
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Your audit report has been generated and sent to your email.
        </p>

        {lead && (
          <div className="border border-gray-200 rounded-lg p-4 text-left mb-6 space-y-2.5">
            <Row label="Sent to" value={lead.email} />
            <Row label="Company" value={lead.companyName} />
            <Row
              label="Email status"
              value={lead.emailStatus === 'sent' ? 'Delivered' : 'Pending'}
              valueClass={lead.emailStatus === 'sent' ? 'text-green-700' : 'text-yellow-700'}
            />
          </div>
        )}

        <Link
          to="/submit"
          className="inline-block px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Submit another lead
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = 'text-gray-900' }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}
