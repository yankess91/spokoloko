import { t } from '../utils/i18n';

export default function Modal({ title, onClose, children }) {
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="ghost"
            onClick={onClose}
            aria-label={t('modal.closeAria')}
          >
            {t('modal.close')}
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
