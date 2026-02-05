import { t } from './i18n';

export const formatDuration = (value) => {
  if (!value) {
    return t('formatters.noData');
  }

  if (value.startsWith('PT')) {
    const hours = Number(value.match(/(\d+)H/)?.[1] ?? 0);
    const minutes = Number(value.match(/(\d+)M/)?.[1] ?? 0);
    const parts = [];
    if (hours) {
      parts.push(`${hours}h`);
    }
    if (minutes) {
      parts.push(`${minutes}min`);
    }
    return parts.length ? parts.join(' ') : t('formatters.zeroMinutes');
  }

  if (value.includes(':')) {
    const [hours, minutes] = value.split(':');
    const hourValue = Number(hours);
    const minuteValue = Number(minutes);
    const parts = [];
    if (!Number.isNaN(hourValue) && hourValue > 0) {
      parts.push(`${hourValue}h`);
    }
    if (!Number.isNaN(minuteValue) && minuteValue > 0) {
      parts.push(`${minuteValue}min`);
    }
    return parts.length ? parts.join(' ') : value;
  }

  return value;
};

export const formatDate = (value) =>
  new Date(value).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

export const formatTime = (value) =>
  new Date(value).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit'
  });

export const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return t('formatters.noPrice');
  }

  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2
  }).format(Number(value));
};
