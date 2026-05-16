import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitLead } from '../services/api';
import { validateLeadForm } from '../utils/validation';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  companyName: '',
  website: '',
  industry: '',
};

export function useLeadSubmission() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);

    const { isValid, errors: validationErrors } = validateLeadForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitLead(formData);
      const leadId = result.data.leadId;
      navigate(`/processing/${leadId}`);
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.error?.details?.[0]?.message ||
        'Something went wrong. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    submitError,
    handleChange,
    handleSubmit,
  };
}
