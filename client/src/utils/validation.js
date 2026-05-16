export function validateLeadForm(data) {
  const errors = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.companyName || data.companyName.trim().length < 1) {
    errors.companyName = 'Company name is required';
  }

  if (!data.website || !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/i.test(data.website)) {
    errors.website = 'Please enter a valid website URL';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
