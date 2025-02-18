export const generateYears = (): { label: string; value: string }[] => {
  const startYear = 2024;
  const currentYear = new Date().getFullYear();
  const years: { label: string; value: string }[] = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push({ label: year.toString(), value: year.toString() });
  }

  return years.reverse();
};

export const years = generateYears();
