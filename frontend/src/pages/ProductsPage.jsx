import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import Modal from '../components/Modal';
import useProducts from '../hooks/useProducts';
import { useToast } from '../components/ToastProvider';
import AddIcon from '@mui/icons-material/Add';
import { t } from '../utils/i18n';
import { createCollator, includesNormalizedValue, normalizeSearchTerm } from '../utils/collectionOptimizers';

const collator = createCollator();
const pageSize = 8;

export default function ProductsPage() {
  const { products, isLoading, error, addProduct, updateProduct, removeProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [brandFilter, setBrandFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');

  const brandOptions = useMemo(() => {
    const brands = new Set();

    for (const product of products) {
      const brand = product.brand?.trim();
      if (brand) {
        brands.add(brand);
      }
    }

    return Array.from(brands).sort(collator.compare);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeSearchTerm(deferredSearchTerm);

    return products.filter((product) => {
      const matchesSearch = includesNormalizedValue([product.name, product.brand, product.notes], normalizedSearch);
      const matchesBrand = brandFilter === 'all' || (product.brand?.trim().toLocaleLowerCase('pl') ?? '') === brandFilter;
      const matchesAvailability =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && product.isAvailable) ||
        (availabilityFilter === 'unavailable' && !product.isAvailable);

      return matchesSearch && matchesBrand && matchesAvailability;
    });
  }, [products, deferredSearchTerm, brandFilter, availabilityFilter]);

  const sortedProducts = useMemo(() => {
    const getPrice = (product) => Number(product.price ?? 0);
    const getAvailabilityCheckedAt = (product) => Date.parse(product.availabilityCheckedAt ?? '') || 0;
    const items = [...filteredProducts];

    items.sort((a, b) => {
      switch (sortBy) {
        case 'name-desc':
          return collator.compare(b.name ?? '', a.name ?? '');
        case 'brand-asc':
          return collator.compare(a.brand ?? '', b.brand ?? '');
        case 'brand-desc':
          return collator.compare(b.brand ?? '', a.brand ?? '');
        case 'price-asc':
          return getPrice(a) - getPrice(b);
        case 'price-desc':
          return getPrice(b) - getPrice(a);
        case 'availability-checked-desc':
          return getAvailabilityCheckedAt(b) - getAvailabilityCheckedAt(a);
        case 'availability-checked-asc':
          return getAvailabilityCheckedAt(a) - getAvailabilityCheckedAt(b);
        case 'name-asc':
        default:
          return collator.compare(a.name ?? '', b.name ?? '');
      }
    });

    return items;
  }, [filteredProducts, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [currentPage, sortedProducts]);

  const showError = useCallback((message) => showToast(message, { severity: 'error' }), [showToast]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchTerm, brandFilter, availabilityFilter, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast(t('productsPage.toastUpdated'));
      } else {
        await addProduct(payload);
        showToast(t('productsPage.toastSaved'));
      }
      closeModal();
    } catch (err) {
      showError(err.message ?? t('productsPage.toastSaveError'));
      return false;
    } finally {
      setIsSubmitting(false);
    }

    return true;
  };

  const handleDelete = async (product) => {
    if (!window.confirm(t('productsPage.deleteConfirm', { name: product.name }))) {
      return;
    }
    try {
      await removeProduct(product.id);
      showToast(t('productsPage.toastDeleted'));
    } catch (err) {
      showError(err.message ?? t('productsPage.toastDeleteError'));
    }
  };

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>{t('productsPage.title')}</h1>
        <p className="muted">{t('productsPage.subtitle')}</p>
      </header>

      <section className="stack">
        <article className="card">
          <header className="card-header">
            <div>
              <h2>{t('productsPage.listTitle')}</h2>
              <p className="muted">{t('productsPage.listSubtitle')}</p>
            </div>
          </header>
          <div className="grid-actions">
            <button
              type="button"
              className="primary"
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
            >
              <AddIcon fontSize="small" />
              {t('productsPage.newProduct')}
            </button>
          </div>
          <div className="list-controls grid-controls">
            <label className="filter-field">
              {t('productsPage.filterLabel')}
              <input
                type="search"
                placeholder={t('productsPage.searchPlaceholder')}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
            <label className="filter-field">
              {t('productsPage.brandLabel')}
              <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
                <option value="all">{t('productsPage.brandAll')}</option>
                {brandOptions.map((brand) => (
                  <option key={brand} value={brand.toLocaleLowerCase('pl')}>{brand}</option>
                ))}
              </select>
            </label>
            <label className="filter-field">
              {t('productsPage.availabilityLabel')}
              <select value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value)}>
                <option value="all">{t('productsPage.availabilityAll')}</option>
                <option value="available">{t('productsPage.availabilityAvailable')}</option>
                <option value="unavailable">{t('productsPage.availabilityUnavailable')}</option>
              </select>
            </label>
            <label className="filter-field">
              {t('productsPage.sortLabel')}
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="name-asc">{t('productsPage.sortNameAsc')}</option>
                <option value="name-desc">{t('productsPage.sortNameDesc')}</option>
                <option value="brand-asc">{t('productsPage.sortBrandAsc')}</option>
                <option value="brand-desc">{t('productsPage.sortBrandDesc')}</option>
                <option value="price-asc">{t('productsPage.sortPriceAsc')}</option>
                <option value="price-desc">{t('productsPage.sortPriceDesc')}</option>
                <option value="availability-checked-desc">{t('productsPage.sortCheckedDesc')}</option>
                <option value="availability-checked-asc">{t('productsPage.sortCheckedAsc')}</option>
              </select>
            </label>
          </div>
          <ProductList
            products={paginatedProducts}
            isLoading={isLoading}
            linkBase="/products"
            onEdit={(product) => {
              setEditingProduct(product);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
          {!isLoading && sortedProducts.length > 0 ? (
            <div className="pagination-controls" aria-label={t('pagination.ariaLabel')}>
              <button
                type="button"
                className="ghost"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                {t('pagination.previous')}
              </button>
              <span className="pagination-status">{t('pagination.status', { current: currentPage, total: totalPages })}</span>
              <button
                type="button"
                className="ghost"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                {t('pagination.next')}
              </button>
            </div>
          ) : null}
        </article>
      </section>

      {isModalOpen ? (
        <Modal title={editingProduct ? t('productsPage.editModalTitle') : t('productsPage.modalTitle')} onClose={closeModal}>
          <ProductForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            initialValues={editingProduct}
            showTitle={false}
            variant="plain"
          />
        </Modal>
      ) : null}
    </div>
  );
}
