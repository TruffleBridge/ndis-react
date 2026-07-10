export const validateRequired = (
  value: string | null | undefined,
  label: string
) => {
  if (!value?.trim()) return `${label} is required`;
  return "";
};

export const validateEmail = (value: string) => {
  const required = validateRequired(value, "Email");
  if (required) return required;

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value) ? "" : "Invalid email address";
};

export const validateMobile = (value: string) => {
  const required = validateRequired(value, "Mobile");
  if (required) return required;

  return /^\d{10}$/.test(value) ? "" : "Invalid mobile number";
};