import { Link } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { formatCurrency } from '../utils/formatters';
import { t } from '../utils/i18n';

export default function ServiceList({ services, isLoading, linkBase, onDelete }) {
  if (isLoading) {
    return <p className="muted">{t('serviceList.loading')}</p>;
  }

  if (services.length === 0) {
    return <p className="muted">{t('serviceList.empty')}</p>;
  }

  const isDeleteDisabled = !onDelete;

  const columns = [
    {
      field: 'service',
      headerName: t('serviceList.columns.service'),
      flex: 1.4,
      minWidth: 280,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            {params.row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.description || t('serviceList.noDescription')}
          </Typography>
        </Box>
      )
    },
    {
      field: 'timePrice',
      headerName: t('serviceList.columns.timePrice'),
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            {params.row.duration}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatCurrency(params.row.price)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'requiredProducts',
      headerName: t('serviceList.columns.products'),
      minWidth: 120,
      valueGetter: (params) => params.row.requiredProductIds?.length ?? params.row.requiredProducts?.length ?? 0
    },
    {
      field: 'actions',
      headerName: t('serviceList.columns.actions'),
      minWidth: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ py: 0.5 }}>
          {linkBase ? (
            <Button
              component={Link}
              to={`${linkBase}/${params.row.id}`}
              size="small"
              variant="text"
              startIcon={<VisibilityOutlinedIcon fontSize="small" />}
            >
              {t('serviceList.details')}
            </Button>
          ) : null}
          <Button
            type="button"
            size="small"
            color="error"
            variant="text"
            onClick={() => onDelete?.(params.row)}
            disabled={isDeleteDisabled}
            title={isDeleteDisabled ? t('serviceList.deleteDisabled') : t('serviceList.delete')}
            startIcon={<DeleteOutlineIcon fontSize="small" />}
          >
            {t('serviceList.delete')}
          </Button>
        </Stack>
      )
    }
  ];

  return (
    <DataGrid
      aria-label={t('serviceList.ariaLabel')}
      autoHeight
      rows={services}
      columns={columns}
      getRowId={(row) => row.id}
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25, 50]}
      initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
      sx={{ backgroundColor: 'background.paper' }}
    />
  );
}
