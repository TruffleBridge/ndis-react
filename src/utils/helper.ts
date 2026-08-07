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

export const formatDate = (date: string | Date) => {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

export const TimeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);

  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) {
    return "Just now";
  }
  if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  }
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (days === 1) {
    return "1 day ago";
  }
  return `${days} days ago`;
}