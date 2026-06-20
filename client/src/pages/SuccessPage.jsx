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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <a
            href={`${import.meta.env.VITE_API_URL || '/api'}/leads/${leadId}/download`}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Download Audit Report
          </a>

          <Link
            to="/submit"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition-colors"
          >
            Submit another lead
          </Link>
        </div>
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
