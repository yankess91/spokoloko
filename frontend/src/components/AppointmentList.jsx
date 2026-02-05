import { Link } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
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

  const columns = [
    {
      field: 'appointment',
      headerName: t('appointmentList.columns.appointment'),
      flex: 1.2,
      minWidth: 260,
      sortable: false,
      renderCell: (params) => {
        const service = servicesById.get(params.row.serviceId);
        return (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              {service?.name ?? t('appointmentList.unknownService')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.notes || t('appointmentList.noNotes')}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'date',
      headerName: t('appointmentList.columns.date'),
      minWidth: 170,
      sortable: true,
      valueGetter: (params) => params.row.startAt,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            {formatDate(params.row.startAt)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTime(params.row.startAt)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'client',
      headerName: t('appointmentList.columns.client'),
      flex: 1,
      minWidth: 220,
      sortable: false,
      renderCell: (params) => {
        const client = clientsById.get(params.row.clientId);
        return (
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              {client?.fullName ?? t('appointmentList.unknownClient')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {client?.email || client?.phoneNumber || t('appointmentList.noContact')}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: t('appointmentList.columns.actions'),
      minWidth: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ py: 0.5 }}>
          <Button
            component={Link}
            to={`/appointments/${params.row.id}`}
            size="small"
            variant="text"
            startIcon={<VisibilityOutlinedIcon fontSize="small" />}
          >
            {t('appointmentList.details')}
          </Button>
          <Button
            type="button"
            size="small"
            color="error"
            variant="text"
            onClick={() => onDelete?.(params.row)}
            disabled={isDeleteDisabled}
            title={isDeleteDisabled ? t('appointmentList.deleteDisabled') : t('appointmentList.delete')}
            startIcon={<DeleteOutlineIcon fontSize="small" />}
          >
            {t('appointmentList.delete')}
          </Button>
        </Stack>
      )
    }
  ];

  return (
    <DataGrid
      aria-label={t('appointmentList.ariaLabel')}
      autoHeight
      rows={appointments}
      columns={columns}
      getRowId={(row) => row.id}
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25, 50]}
      initialState={{
        sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
        pagination: { paginationModel: { pageSize: 10, page: 0 } }
      }}
      sx={{ backgroundColor: 'background.paper' }}
    />
  );
}
