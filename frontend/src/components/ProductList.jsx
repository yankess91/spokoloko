import { Link } from 'react-router-dom';
import { useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { formatCurrency, formatDate } from '../utils/formatters';
import { t } from '../utils/i18n';

export default function ProductList({ products, isLoading, linkBase, onDelete }) {
  const [zoomedImage, setZoomedImage] = useState(null);

  if (isLoading) {
    return <p className="muted">{t('productList.loading')}</p>;
  }

  if (products.length === 0) {
    return <p className="muted">{t('productList.empty')}</p>;
  }

  const isDeleteDisabled = !onDelete;

  const columns = [
    {
      field: 'product',
      headerName: t('productList.columns.product'),
      flex: 1.3,
      minWidth: 260,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            {params.row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.notes || t('productList.noNotes')}
          </Typography>
        </Box>
      )
    },
    {
      field: 'brand',
      headerName: t('productList.columns.manufacturer'),
      minWidth: 170,
      valueGetter: (_, row) => row.brand || t('productList.noBrand')
    },
    {
      field: 'price',
      headerName: t('productList.columns.price'),
      minWidth: 120,
      valueFormatter: (value) => formatCurrency(value)
    },
    {
      field: 'availability',
      headerName: t('productList.columns.availability'),
      minWidth: 150,
      valueGetter: (_, row) =>
        row.isAvailable ? t('productList.available') : t('productList.unavailable')
    },
    {
      field: 'availabilityCheckedAt',
      headerName: t('productList.columns.availabilityCheckedAt'),
      minWidth: 180,
      valueGetter: (_, row) =>
        row.availabilityCheckedAt
          ? formatDate(row.availabilityCheckedAt)
          : t('productList.noAvailabilityDate')
    },
    {
      field: 'image',
      headerName: t('productList.columns.image'),
      minWidth: 120,
      sortable: false,
      renderCell: (params) =>
        params.row.imageUrl ? (
          <IconButton
            size="small"
            onClick={() => setZoomedImage({ src: params.row.imageUrl, name: params.row.name })}
            title={t('productList.zoomImage')}
          >
            <ZoomInIcon fontSize="small" />
          </IconButton>
        ) : (
          <Typography variant="caption" color="text.secondary">
            {t('productList.noImage')}
          </Typography>
        )
    },
    {
      field: 'actions',
      headerName: t('productList.columns.actions'),
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
              {t('productList.details')}
            </Button>
          ) : null}
          <Button
            type="button"
            size="small"
            color="error"
            variant="text"
            onClick={() => onDelete?.(params.row)}
            disabled={isDeleteDisabled}
            title={isDeleteDisabled ? t('productList.deleteDisabled') : t('productList.delete')}
            startIcon={<DeleteOutlineIcon fontSize="small" />}
          >
            {t('productList.delete')}
          </Button>
        </Stack>
      )
    }
  ];

  return (
    <>
      <DataGrid
        aria-label={t('productList.ariaLabel')}
        autoHeight
        rows={products}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        sx={{ backgroundColor: 'background.paper' }}
      />

      {zoomedImage ? (
        <div className="image-zoom-backdrop" onClick={() => setZoomedImage(null)}>
          <div className="image-zoom-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="ghost icon-button image-zoom-close"
              onClick={() => setZoomedImage(null)}
            >
              <CloseIcon fontSize="small" />
              {t('modal.close')}
            </button>
            <img className="image-zoom-preview" src={zoomedImage.src} alt={zoomedImage.name} />
          </div>
        </div>
      ) : null}
    </>
  );
}
