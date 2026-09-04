const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const formatDateTime = (date) => {
  if (!date) return '—';
  return `${formatDate(date)} ${formatTime(date)}`;
};

const getDaysDifference = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffTime = Math.abs(new Date(date2) - new Date(date1));
  return Math.ceil(diffTime / oneDay);
};

const getWeekAgo = () => {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
};

const getMonthAgo = () => {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
};

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  getDaysDifference,
  getWeekAgo,
  getMonthAgo
};
