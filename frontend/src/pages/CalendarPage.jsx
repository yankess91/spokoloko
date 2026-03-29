import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import useAppointments from '../hooks/useAppointments';
import useClients from '../hooks/useClients';
import useServices from '../hooks/useServices';
import { t } from '../utils/i18n';

dayjs.locale('pl');

const START_HOUR = 7;
const END_HOUR = 22;
const HOUR_HEIGHT = 72;
const DAY_NAMES = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'niedz.'];

export default function CalendarPage() {
  const { appointments, isLoading, error } = useAppointments();
  const { clients } = useClients();
  const { services } = useServices();
  const [viewMode, setViewMode] = useState('week');
  const [anchorDate, setAnchorDate] = useState(dayjs());

  const clientsById = useMemo(() => new Map(clients.map((client) => [client.id, client])), [clients]);
  const servicesById = useMemo(() => new Map(services.map((service) => [service.id, service])), [services]);

  const days = useMemo(() => {
    if (viewMode === 'day') {
      return [anchorDate.startOf('day')];
    }

    if (viewMode === 'month') {
      return [];
    }

    const weekStart = anchorDate.startOf('week');
    return Array.from({ length: 7 }, (_, index) => weekStart.add(index, 'day'));
  }, [anchorDate, viewMode]);

  const monthDays = useMemo(() => {
    if (viewMode !== 'month') {
      return [];
    }

    const monthStart = anchorDate.startOf('month');
    const monthEnd = anchorDate.endOf('month');
    const firstDay = monthStart.startOf('week');
    const lastDay = monthEnd.endOf('week');
    const totalDays = lastDay.diff(firstDay, 'day') + 1;

    return Array.from({ length: totalDays }, (_, index) => {
      const date = firstDay.add(index, 'day');
      return {
        date,
        key: date.format('YYYY-MM-DD'),
        isCurrentMonth: date.month() === anchorDate.month(),
        isToday: date.isSame(dayjs(), 'day'),
      };
    });
  }, [anchorDate, viewMode]);

  const visibleAppointments = useMemo(() => {
    const dayStarts = days.map((day) => day.startOf('day'));

    return appointments
      .map((appointment) => {
        const start = dayjs(appointment.startAt);
        const end = dayjs(appointment.endAt);
        const dayIndex = dayStarts.findIndex((dayStart) => start.isSame(dayStart, 'day'));

        if (dayIndex === -1) {
          return null;
        }

        const service = servicesById.get(appointment.serviceId);
        const client = clientsById.get(appointment.clientId);
        const startInMinutes = start.hour() * 60 + start.minute();
        const endInMinutes = end.hour() * 60 + end.minute();
        const calendarStartMinutes = START_HOUR * 60;
        const top = ((startInMinutes - calendarStartMinutes) / 60) * HOUR_HEIGHT;
        const height = Math.max(((endInMinutes - startInMinutes) / 60) * HOUR_HEIGHT, 38);

        return {
          id: appointment.id,
          dayIndex,
          top,
          height,
          title: service?.name ?? t('calendarPage.unknownService'),
          client: client?.fullName ?? t('calendarPage.unknownClient'),
          timeLabel: `${start.format('HH:mm')} - ${end.format('HH:mm')}`,
        };
      })
      .filter(Boolean);
  }, [appointments, days, servicesById, clientsById]);

  const monthAppointmentsByDay = useMemo(() => {
    if (viewMode !== 'month') {
      return new Map();
    }

    return appointments.reduce((grouped, appointment) => {
      const start = dayjs(appointment.startAt);
      const key = start.format('YYYY-MM-DD');
      const service = servicesById.get(appointment.serviceId);
      const client = clientsById.get(appointment.clientId);
      const existing = grouped.get(key) ?? [];

      existing.push({
        id: appointment.id,
        timeLabel: start.format('HH:mm'),
        title: service?.name ?? t('calendarPage.unknownService'),
        client: client?.fullName ?? t('calendarPage.unknownClient'),
      });

      grouped.set(key, existing.sort((a, b) => a.timeLabel.localeCompare(b.timeLabel)));
      return grouped;
    }, new Map());
  }, [appointments, clientsById, servicesById, viewMode]);

  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, index) => START_HOUR + index);

  const calendarHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
  const dayColumnCount = days.length;

  const headerLabel =
    viewMode === 'day'
      ? anchorDate.format('dddd, D MMMM YYYY')
      : viewMode === 'month'
        ? anchorDate.format('MMMM YYYY')
        : `${days[0].format('D MMM')} - ${days[days.length - 1].format('D MMM YYYY')}`;

  const moveWindow = (direction) => {
    if (viewMode === 'day') {
      setAnchorDate((current) => current.add(direction, 'day'));
      return;
    }

    if (viewMode === 'month') {
      setAnchorDate((current) => current.add(direction, 'month'));
      return;
    }

    setAnchorDate((current) => current.add(direction, 'week'));
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{t('calendarPage.title')}</h1>
        <p className="muted">{t('calendarPage.subtitle')}</p>
      </header>

      <section className="card calendar-view">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton aria-label={t('calendarPage.previous')} onClick={() => moveWindow(-1)}>
              <ChevronLeftRoundedIcon />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 240, textTransform: 'capitalize' }}>
              {headerLabel}
            </Typography>
            <IconButton aria-label={t('calendarPage.next')} onClick={() => moveWindow(1)}>
              <ChevronRightRoundedIcon />
            </IconButton>
            <IconButton
              aria-label={t('calendarPage.today')}
              onClick={() => setAnchorDate(dayjs())}
              title={t('calendarPage.today')}
            >
              <TodayRoundedIcon />
            </IconButton>
          </Stack>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, next) => {
              if (next) {
                setViewMode(next);
              }
            }}
            size="small"
          >
            <ToggleButton value="month">{t('calendarPage.month')}</ToggleButton>
            <ToggleButton value="week">{t('calendarPage.week')}</ToggleButton>
            <ToggleButton value="day">{t('calendarPage.day')}</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {isLoading ? <p className="muted">{t('calendarPage.loading')}</p> : null}
        {!isLoading && error ? <p className="muted">{error}</p> : null}

        {!isLoading && !error && viewMode === 'month' ? (
          <Box className="calendar-month-shell">
            <div className="calendar-month-head">
              {DAY_NAMES.map((dayName) => (
                <div key={dayName} className="calendar-month-head-cell">
                  {dayName}
                </div>
              ))}
            </div>
            <div className="calendar-month-grid">
              {monthDays.map((day) => {
                const dayAppointments = monthAppointmentsByDay.get(day.key) ?? [];

                return (
                  <article
                    key={day.key}
                    className={`calendar-month-day${day.isCurrentMonth ? '' : ' is-muted'}${day.isToday ? ' is-today' : ''}`}
                  >
                    <header>
                      <span>{day.date.format('D')}</span>
                    </header>
                    <div className="calendar-month-events">
                      {dayAppointments.length === 0 ? null : dayAppointments.slice(0, 3).map((appointment) => (
                        <p key={appointment.id} className="calendar-month-event" title={`${appointment.title} · ${appointment.client}`}>
                          <strong>{appointment.timeLabel}</strong> {appointment.title}
                        </p>
                      ))}
                      {dayAppointments.length > 3 ? (
                        <p className="calendar-month-more">+{dayAppointments.length - 3}</p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </Box>
        ) : null}

        {!isLoading && !error && viewMode !== 'month' ? (
          <Box className="calendar-shell" sx={{ ['--day-columns']: dayColumnCount, ['--calendar-height']: `${calendarHeight}px` }}>
            <div className="calendar-head">
              <div className="calendar-time-col" />
              {days.map((day) => (
                <div key={day.toISOString()} className="calendar-day-head">
                  <span>{day.format('ddd')}</span>
                  <strong>{day.format('D MMM')}</strong>
                </div>
              ))}
            </div>

            <div className="calendar-body" style={{ height: calendarHeight }}>
              <div className="calendar-hours">
                {hours.map((hour) => (
                  <div key={hour} className="calendar-hour-label">
                    {String(hour).padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              <div className="calendar-grid-area">
                <div className="calendar-grid-lines">
                  {hours.map((hour) => (
                    <div key={hour} className="calendar-grid-line" />
                  ))}
                </div>

                <div className="calendar-events-layer">
                  {visibleAppointments.length === 0 ? (
                    <div className="calendar-empty">{t('calendarPage.noEvents')}</div>
                  ) : (
                    visibleAppointments.map((appointment) => (
                      <article
                        key={appointment.id}
                        className="calendar-event-card"
                        style={{
                          top: `${appointment.top}px`,
                          height: `${appointment.height}px`,
                          left: `calc(${(appointment.dayIndex / dayColumnCount) * 100}% + 6px)`,
                          width: `calc(${100 / dayColumnCount}% - 12px)`,
                        }}
                      >
                        <p className="calendar-event-title">{appointment.title}</p>
                        <p className="calendar-event-client">{appointment.client}</p>
                        <p className="calendar-event-time">{appointment.timeLabel}</p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Box>
        ) : null}
      </section>
    </div>
  );
}
