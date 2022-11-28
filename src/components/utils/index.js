export const copyArray = arr => {
  return [...arr.map(rows => [...rows])];
};

export const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
};

export const getDayKey = () => {
  const now = new Date();
  let year = now.getFullYear();
  return `day-${getDayOfYear()}-${year}`;
};
