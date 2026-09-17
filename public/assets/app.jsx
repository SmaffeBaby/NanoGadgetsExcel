const { useMemo, useState } = React;

const emptyProduct = {
  category: '',
  sku: '',
  name: '',
  price: 1000,
  stock: 0,
  date: '2025-01-15',
  unit: 'Штука',
  note: '',
};

const initialProducts = [
  {
    category: 'Умные кольца',
    sku: 'NG-RNG-001',
    name: 'Кольцо-трекер пульса SmartRing Pro',
    price: 18990,
    stock: 7,
    date: '2025-10-10',
    unit: 'Штука',
    note: 'Критический остаток',
  },
  {
    category: 'Мини-проекторы',
    sku: 'NG-PRJ-014',
    name: 'Карманный проектор PocketBeam Air',
    price: 34990,
    stock: 46,
    date: '2025-05-22',
    unit: 'Штука',
    note: 'Ходовой товар',
  },
  {
    category: 'Носимые гаджеты',
    sku: 'NG-WCH-027',
    name: 'Фитнес-браслет PulseBand Lite',
    price: 5990,
    stock: 138,
    date: '2025-02-18',
    unit: 'Штука',
    note: 'Запас достаточный',
  },
  {
    category: 'Умный дом',
    sku: 'NG-HUB-009',
    name: 'Мини-хаб управления HomeDot Mini',
    price: 11990,
    stock: 103,
    date: '2025-08-04',
    unit: 'Штука',
    note: 'Запас достаточный',
  },
];

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))],
    [products],
  );

  const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const totalValue = products.reduce(
    (sum, product) => sum + Number(product.price || 0) * Number(product.stock || 0),
    0,
  );
  const lowStockCount = products.filter((product) => Number(product.stock) < 10).length;

  function updateProduct(index, field, value) {
    setProducts((current) =>
      current.map((product, productIndex) =>
        productIndex === index ? { ...product, [field]: value } : product,
      ),
    );
  }

  function addProduct() {
    setProducts((current) => [...current, { ...emptyProduct }]);
  }

  function duplicateProduct(index) {
    setProducts((current) => {
      const copy = { ...current[index], sku: `${current[index].sku}-COPY` };
      return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)];
    });
  }

  function removeProduct(index) {
    setProducts((current) => current.filter((_, productIndex) => productIndex !== index));
  }

  async function downloadReport() {
    setError('');
    setIsDownloading(true);

    try {
      const response = await fetch('/api/download-xlsx.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || 'Не удалось сформировать файл.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'NanoGadgets_report.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(downloadError.message);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ocean">
                NanoGadgets
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-ink">Генератор складского отчета</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Добавьте позиции ассортимента, проверьте остатки и скачайте готовый Excel-файл с
                фильтрами и условным форматированием.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadReport}
              disabled={isDownloading}
              className="inline-flex h-11 items-center justify-center rounded-md bg-ocean px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B5966] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloading ? 'Формируем файл...' : 'Скачать XLSX'}
            </button>
          </div>
          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <Metric label="Товаров" value={products.length} />
          <Metric label="Остаток" value={totalStock} />
          <Metric label="Меньше 10" value={lowStockCount} tone="danger" />
          <div className="col-span-3 rounded-md bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Стоимость остатков</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{formatRub(totalValue)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink">Категории</h2>
            <span className="rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-ocean">
              {categories.length}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
              >
                {category}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={addProduct}
            className="mt-5 flex h-10 w-full items-center justify-center rounded-md border border-ocean bg-white text-sm font-semibold text-ocean transition hover:bg-mint"
          >
            Добавить товар
          </button>
        </aside>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-ink">Ассортимент</h2>
            <p className="text-sm text-slate-500">Цена: 1000-50000 ₽, остаток: 0-200</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1120px] w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="bg-[#155E75] text-left text-white">
                  <Th>Категория</Th>
                  <Th>Артикул</Th>
                  <Th>Название</Th>
                  <Th>Цена</Th>
                  <Th>Остаток</Th>
                  <Th>Дата</Th>
                  <Th>Примечание</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <ProductRow
                    key={`${product.sku}-${index}`}
                    product={product}
                    index={index}
                    onChange={updateProduct}
                    onDuplicate={duplicateProduct}
                    onRemove={removeProduct}
                    canRemove={products.length > 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value, tone = 'default' }) {
  const toneClass = tone === 'danger' ? 'text-red-700 bg-red-50' : 'text-ink bg-slate-50';
  return (
    <div className={`rounded-md px-4 py-3 ${toneClass}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ProductRow({ product, index, onChange, onDuplicate, onRemove, canRemove }) {
  const stock = Number(product.stock);
  const stockClass =
    stock < 10
      ? 'border-red-200 bg-red-50 text-red-700'
      : stock > 100
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-slate-200 bg-white text-slate-900';

  return (
    <tr className="border-b border-slate-100">
      <Td>
        <Input value={product.category} onChange={(value) => onChange(index, 'category', value)} />
      </Td>
      <Td>
        <Input value={product.sku} onChange={(value) => onChange(index, 'sku', value)} />
      </Td>
      <Td className="min-w-[260px]">
        <Input value={product.name} onChange={(value) => onChange(index, 'name', value)} />
      </Td>
      <Td className="w-28">
        <Input
          type="number"
          min="1000"
          max="50000"
          value={product.price}
          onChange={(value) => onChange(index, 'price', Number(value))}
        />
      </Td>
      <Td className="w-24">
        <Input
          className={stockClass}
          type="number"
          min="0"
          max="200"
          value={product.stock}
          onChange={(value) => onChange(index, 'stock', Number(value))}
        />
      </Td>
      <Td className="w-40">
        <Input type="date" value={product.date} onChange={(value) => onChange(index, 'date', value)} />
      </Td>
      <Td className="min-w-[190px]">
        <Input value={product.note} onChange={(value) => onChange(index, 'note', value)} />
      </Td>
      <Td className="w-28">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onDuplicate(index)}
            title="Дублировать"
            className="h-9 w-9 rounded-md border border-slate-200 text-slate-600 transition hover:border-ocean hover:text-ocean"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={!canRemove}
            title="Удалить"
            className="h-9 w-9 rounded-md border border-slate-200 text-slate-600 transition hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ×
          </button>
        </div>
      </Td>
    </tr>
  );
}

function Input({ value, onChange, className = '', ...props }) {
  return (
    <input
      {...props}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`h-10 w-full rounded-md border px-3 text-sm outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20 ${className || 'border-slate-200 bg-white text-slate-900'}`}
    />
  );
}

function Th({ children }) {
  return <th className="border-r border-white/20 px-3 py-3 text-sm font-semibold">{children}</th>;
}

function Td({ children, className = '' }) {
  return <td className={`border-b border-slate-100 px-3 py-2 align-middle ${className}`}>{children}</td>;
}

function formatRub(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
