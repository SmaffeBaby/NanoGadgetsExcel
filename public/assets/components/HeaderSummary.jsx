function HeaderSummary({
  error,
  isDownloading,
  isDirty,
  isLoading,
  isSaving,
  metrics,
  onDiscard,
  onDownload,
  onSave,
}) {
  return (
    <section>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ocean">
              NanoGadgets
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">Складской отчет</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isDirty ? (
              <div className="flex flex-wrap items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5">
                <span className="text-xs font-medium text-amber-800">Сохранить изменения?</span>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  className="h-7 rounded bg-ocean px-2.5 text-xs font-semibold text-white transition hover:bg-[#0B5966] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Да
                </button>
                <button
                  type="button"
                  onClick={onDiscard}
                  disabled={isSaving}
                  className="h-7 rounded border border-amber-200 bg-white px-2.5 text-xs font-semibold text-amber-800 transition hover:border-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Нет
                </button>
              </div>
            ) : (
              <span className="text-xs text-slate-500">
                {isSaving ? 'Сохраняю...' : 'Сохранено'}
              </span>
            )}
            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading || isLoading}
              className="inline-flex h-10 items-center justify-center rounded-md bg-ocean px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B5966] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloading ? 'Формируем...' : 'Скачать XLSX'}
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Товаров" value={metrics.productsCount} />
          <Metric label="Мало" value={metrics.lowStockCount} tone="danger" />
          <Metric label="Остаток" value={metrics.totalStock} />
          <Metric label="Сумма" value={formatRub(metrics.totalValue)} />
        </div>
        {error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value, tone = 'default' }) {
  const toneClass = tone === 'danger' ? 'text-red-700 bg-red-50' : 'text-ink bg-slate-50';
  return (
    <div className={`min-w-0 rounded-md px-3 py-2 ${toneClass}`}>
      <p className="text-[11px] font-medium uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 whitespace-nowrap text-lg font-semibold">{value}</p>
    </div>
  );
}

function formatRub(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

window.HeaderSummary = HeaderSummary;
window.Metric = Metric;
window.formatRub = formatRub;
