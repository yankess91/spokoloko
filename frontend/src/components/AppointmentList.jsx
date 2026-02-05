import { Link } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { formatDate, formatTime } from '../utils/formatters';
import { t } from '../utils/i18n';

export default function AppointmentList({
  appointments,
  clientsById,
  servicesById,
  isLoading,
  onDelete
}) {
  if (isLoading) {
    return <p className="muted">{t('appointmentList.loading')}</p>;
  }

  if (appointments.length === 0) {
    return <p className="muted">{t('appointmentList.empty')}</p>;
  }

  const isDeleteDisabled = !onDelete;

  return (
    <div className="data-grid data-grid-appointments" role="table" aria-label={t('appointmentList.ariaLabel')}>
      <div className="data-grid-row data-grid-header" role="row">
        <span className="data-grid-cell" role="columnheader">
          {t('appointmentList.columns.appointment')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('appointmentList.columns.date')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('appointmentList.columns.client')}
        </span>
        <span className="data-grid-cell" role="columnheader">
          {t('appointmentList.columns.actions')}
        </span>
      </div>
      {appointments.map((appointment) => {
        const client = clientsById.get(appointment.clientId);
        const service = servicesById.get(appointment.serviceId);
        return (
          <div key={appointment.id} className="data-grid-row" role="row">
            <div className="data-grid-cell" role="cell">
              <div className="data-grid-title">
                {service?.name ?? t('appointmentList.unknownService')}
              </div>
              <div className="data-grid-meta">
                {appointment.notes || t('appointmentList.noNotes')}
              </div>
            </div>
            <div className="data-grid-cell" role="cell">
              <span className="data-grid-title">{formatDate(appointment.startAt)}</span>
              <span className="data-grid-meta">{formatTime(appointment.startAt)}</span>
            </div>
            <div className="data-grid-cell" role="cell">
              <span className="data-grid-title">
                {client?.fullName ?? t('appointmentList.unknownClient')}
              </span>
              <span className="data-grid-meta">
                {client?.email || client?.phoneNumber || t('appointmentList.noContact')}
              </span>
            </div>
            <div className="data-grid-cell data-grid-actions" role="cell">
              <Link className="ghost" to={`/appointments/${appointment.id}`}>
                <VisibilityOutlinedIcon fontSize="small" />
                {t('appointmentList.details')}
              </Link>
              <button
                type="button"
                className="ghost danger icon-button"
                onClick={() => onDelete?.(appointment)}
                disabled={isDeleteDisabled}
                title={isDeleteDisabled ? t('appointmentList.deleteDisabled') : t('appointmentList.delete')}
              >
                <DeleteOutlineIcon fontSize="small" />
                {t('appointmentList.delete')}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
