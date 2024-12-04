export const isDateInCurrentMonth = (date: Date): boolean => {
  var currentTime = new Date();
  var currentYear = currentTime.getFullYear();
  var currentMonth = currentTime.getMonth();

  var evaluatedDate = new Date(date);
  var evaluateYear = evaluatedDate.getFullYear();
  var evaluateMonth = evaluatedDate.getMonth();

  return currentYear === evaluateYear && currentMonth === evaluateMonth
    ? true
    : false;
};
