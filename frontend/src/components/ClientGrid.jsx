import { Link } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { t } from '../utils/i18n';

export default function ClientGrid({
  clients,
  isLoading,
  linkBase,
  onToggleStatus,
  updatingClientId,
  onDelete
}) {
  if (isLoading) {
    return <p className="muted">{t('clientGrid.loading')}</p>;
  }

  if (clients.length === 0) {
    return <p className="muted">{t('clientGrid.empty')}</p>;
  }

  const isDeleteDisabled = !onDelete;

  const columns = [
    {
      field: 'client',
      headerName: t('clientGrid.columns.client'),
      flex: 1.6,
      minWidth: 280,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            {params.row.fullName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.email || t('clientGrid.noEmail')} ·{' '}
            {params.row.phoneNumber || t('clientGrid.noPhone')}
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: t('clientGrid.columns.status'),
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Chip
          size="small"
          color={params.row.isActive ? 'success' : 'default'}
          label={params.row.isActive ? t('clientGrid.active') : t('clientGrid.inactive')}
        />
      )
    },
    {
      field: 'servicesCount',
      headerName: t('clientGrid.columns.services'),
      minWidth: 120,
      valueGetter: (_, row) => row.serviceHistory?.length ?? 0
    },
    {
      field: 'actions',
      headerName: t('clientGrid.columns.actions'),
      minWidth: 300,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const client = params.row;
        const isUpdating = updatingClientId === client.id;

        return (
          <Stack direction="row" spacing={1} sx={{ py: 0.5 }}>
            {linkBase ? (
              <Button
                component={Link}
                to={`${linkBase}/${client.id}`}
                size="small"
                variant="text"
                startIcon={<VisibilityOutlinedIcon fontSize="small" />}
              >
                {t('clientGrid.details')}
              </Button>
            ) : null}
            <Button
              type="button"
              size="small"
              variant="outlined"
              onClick={() => onToggleStatus?.(client)}
              disabled={isUpdating}
              startIcon={
                client.isActive ? (
                  <ToggleOffIcon fontSize="small" />
                ) : (
                  <ToggleOnIcon fontSize="small" />
                )
              }
            >
              {isUpdating
                ? t('clientGrid.saving')
                : client.isActive
                ? t('clientGrid.deactivate')
                : t('clientGrid.activate')}
            </Button>
            <Button
              type="button"
              size="small"
              color="error"
              variant="text"
              onClick={() => onDelete?.(client)}
              disabled={isDeleteDisabled}
              title={isDeleteDisabled ? t('clientGrid.deleteDisabled') : t('clientGrid.delete')}
              startIcon={<DeleteOutlineIcon fontSize="small" />}
            >
              {t('clientGrid.delete')}
            </Button>
          </Stack>
        );
      }
    }
  ];

  return (
    <DataGrid
      aria-label={t('clientGrid.ariaLabel')}
      autoHeight
      rows={clients}
      columns={columns}
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25, 50]}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10, page: 0 }
        }
      }}
      sx={{ backgroundColor: 'background.paper' }}
    />
  );
}
