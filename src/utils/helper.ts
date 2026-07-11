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

/// progress value
export const progressValue = (activeStep: string, isCompleted?: boolean) => {
  const step = activeStep.trim().toLowerCase();
  if (isCompleted) return 100;


  return (
    {
      basic: 0,
      support: 50,
      qual: 75,
      compliance: 100,
    }[step] ?? 0
  );
};