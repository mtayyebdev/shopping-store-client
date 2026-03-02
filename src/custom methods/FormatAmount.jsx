export const formatAmount = (amount) => {
  if (!amount) return "0";

  const number = Number(amount);
  if (number < 1000) return number.toString();

  const units = ["K", "M", "B", "T"];
  let unitIndex = -1;
  let formatted = number;

  while (formatted >= 1000 && unitIndex < units.length - 1) {
    formatted /= 1000;
    unitIndex++;
  }

  return `${parseFloat(formatted.toFixed(1))}${units[unitIndex]}`;
};