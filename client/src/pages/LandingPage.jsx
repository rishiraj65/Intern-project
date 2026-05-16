import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="container-narrow text-center">
          <span className="inline-block text-xs font-medium text-accent bg-accent-light px-2.5 py-1 rounded-full mb-5">
            AI-Powered Audit Reports
          </span>

          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight tracking-tight mb-4">
            Business audits, delivered <br className="hidden sm:block" />
            in minutes — not weeks.
          </h1>

          <p className="text-base text-gray-500 max-w-lg mx-auto mb-8 leading-relaxed">
            Submit your company details and receive a comprehensive, personalized
            audit report powered by AI. No meetings required.
          </p>

          <Link
            to="/submit"
            className="inline-block px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start a free audit →
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="container-wide">
        <hr className="border-gray-100" />
      </div>

      {/* How it works */}
      <section className="py-16 sm:py-20">
        <div className="container-wide">
          <h2 className="text-lg font-semibold text-gray-900 mb-8 text-center">
            How it works
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Submit your details',
                desc: 'Enter your company name, website, and contact info through a simple form.',
              },
              {
                step: '2',
                title: 'AI analyzes your business',
                desc: 'We scrape your website and use AI to generate insights across SEO, UX, and strategy.',
              },
              {
                step: '3',
                title: 'Get your report',
                desc: 'Receive a professional PDF audit report in your inbox within minutes.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="border border-gray-200 rounded-lg p-5"
              >
                <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md mb-3">
                  {item.step}
                </span>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container-wide">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 text-center">
            What's in the report
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Every audit covers these areas, personalized to your business.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {[
              'Executive business summary',
              'Website & content analysis',
              'SEO assessment with score',
              'UX & design review',
              'Automation opportunities',
              'AI integration recommendations',
              'Top 5 priority actions',
              'Professional PDF format',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 rounded-lg">
                <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="container-narrow text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Ready to audit your business?
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Takes less than a minute. Report delivered to your inbox.
          </p>
          <Link
            to="/submit"
            className="inline-block px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start your audit →
          </Link>
        </div>
      </section>
    </div>
  );
}
