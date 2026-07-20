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

export const onlyNumbers = (value: string): string => {
  return value.replace(/\D/g, "");
};


export const getMimeType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
};

// time formatted
export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const h = Number(hours);
  const period = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 || 12;

  return `${String(formattedHour).padStart(2, "0")}:${minutes} ${period}`;
};