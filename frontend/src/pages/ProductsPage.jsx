import { useCallback, useEffect, useMemo, useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import Modal from '../components/Modal';
import useProducts from '../hooks/useProducts';
import { useToast } from '../components/ToastProvider';
import AddIcon from '@mui/icons-material/Add';
import { t } from '../utils/i18n';

export default function ProductsPage() {
  const { products, isLoading, error, addProduct, removeProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');

  const brandOptions = useMemo(() => {
    const brands = products
      .map((product) => product.brand?.trim())
      .filter(Boolean);

    return [...new Set(brands)].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        [product.name, product.brand, product.notes]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesBrand =
        brandFilter === 'all' ||
        (product.brand?.trim().toLowerCase() ?? '') === brandFilter;

      return matchesSearch && matchesBrand;
    });
  }, [products, searchTerm, brandFilter]);

  const sortedProducts = useMemo(() => {
    const collator = new Intl.Collator('pl', { sensitivity: 'base' });
    const getPrice = (product) => Number(product.price ?? 0);

    return [...filteredProducts].sort((a, b) => {
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
        case 'name-asc':
        default:
          return collator.compare(a.name ?? '', b.name ?? '');
      }
    });
  }, [filteredProducts, sortBy]);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [currentPage, sortedProducts]);

  const showError = useCallback(
    (message) => showToast(message, { severity: 'error' }),
    [showToast]
  );

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortedProducts.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await addProduct(payload);
      showToast(t('productsPage.toastSaved'));
      setIsModalOpen(false);
    } catch (err) {
      showError(err.message ?? t('productsPage.toastSaveError'));
    } finally {
      setIsSubmitting(false);
    }
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
            <button type="button" className="primary" onClick={() => setIsModalOpen(true)}>
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
                  <option key={brand} value={brand.toLowerCase()}>
                    {brand}
                  </option>
                ))}
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
              </select>
            </label>
          </div>
          <ProductList
            products={paginatedProducts}
            isLoading={isLoading}
            linkBase="/products"
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
              <span className="pagination-status">
                {t('pagination.status', { current: currentPage, total: totalPages })}
              </span>
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
        <Modal title={t('productsPage.modalTitle')} onClose={() => setIsModalOpen(false)}>
          <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} showTitle={false} variant="plain" />
        </Modal>
      ) : null}
    </div>
  );
}
