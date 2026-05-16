import { useLeadSubmission } from '../hooks/useLeadSubmission';

const INDUSTRIES = [
  '', 'Technology', 'Healthcare', 'Finance', 'Education',
  'E-commerce', 'Real Estate', 'Marketing', 'Manufacturing',
  'Consulting', 'Food & Beverage', 'Travel', 'Other',
];

export default function LeadForm() {
  const { formData, errors, isSubmitting, submitError, handleChange, handleSubmit } =
    useLeadSubmission();

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {submitError}
        </div>
      )}

      <Field label="Full Name" required>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Jane Smith"
          className={inputClass(errors.fullName)}
        />
        {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
      </Field>

      <Field label="Work Email" required>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="jane@company.com"
          className={inputClass(errors.email)}
        />
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
      </Field>

      <Field label="Company Name" required>
        <input
          id="companyName"
          name="companyName"
          type="text"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Acme Inc."
          className={inputClass(errors.companyName)}
        />
        {errors.companyName && <ErrorText>{errors.companyName}</ErrorText>}
      </Field>

      <Field label="Company Website" required>
        <input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://example.com"
          className={inputClass(errors.website)}
        />
        {errors.website && <ErrorText>{errors.website}</ErrorText>}
      </Field>

      <Field label="Industry" hint="optional">
        <select
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          className={inputClass()}
        >
          <option value="">Select an industry</option>
          {INDUSTRIES.filter(Boolean).map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting…' : 'Generate audit report'}
      </button>
    </form>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

function ErrorText({ children }) {
  return <p className="mt-1 text-xs text-red-600">{children}</p>;
}

function inputClass(hasError) {
  const base =
    'w-full px-3 py-2 text-sm border rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-shadow';
  return hasError
    ? `${base} border-red-300 focus:ring-red-400`
    : `${base} border-gray-300 focus:ring-accent`;
}
