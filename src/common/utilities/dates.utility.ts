export const formatDate = (d: Date): string => {
  const mm = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

export const getFirstAndLastDayOfMonth = (
  date: Date = new Date()
): { startDate: string; endDate: string } => {
  //TODO: implement time zones. For now, i'm ignoring them
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  return {
    startDate: formatDate(firstDay),
    endDate: formatDate(lastDay),
  };
};

export const getCurrentDate = (): string => {
  //TODO: Implement time zones
  var today = new Date();

  return formatDate(today);
};
