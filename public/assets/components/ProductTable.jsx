function ProductTable({
  canRemove,
  categories,
  filters,
  isLoading,
  onAddProduct,
  onDuplicate,
  onFilterChange,
  onMenuToggle,
  onPageChange,
  onPageSizeChange,
  onRemove,
  onResetFilters,
  onSort,
  onUpdate,
  openMenuIndex,
  page,
  pageItems,
  pageSize,
  pageSizeOptions,
  productNames,
  productsCount,
  sort,
  totalFiltered,
  totalPages,
}) {
  const startItem = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalFiltered);

  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Ассортимент</h2>
            <p className="mt-1 text-xs text-slate-500">
              Показано {startItem}-{endItem} из {totalFiltered}, всего {productsCount}
            </p>
          </div>
          <button
            type="button"
            onClick={onAddProduct}
            className="h-10 rounded-md border border-ocean bg-white px-4 text-sm font-semibold text-ocean transition hover:bg-mint"
          >
            Добавить товар
          </button>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-[1.1fr_1fr_1.4fr_1.4fr_0.8fr_0.8fr_auto]">
          <Select value={filters.category} onChange={(value) => onFilterChange('category', value)}>
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Input
            value={filters.sku}
            placeholder="Артикул"
            onChange={(value) => onFilterChange('sku', value)}
          />
          <Input
            value={filters.name}
            placeholder="Название"
            onChange={(value) => onFilterChange('name', value)}
          />
          <Input
            value={filters.note}
            placeholder="Примечание"
            onChange={(value) => onFilterChange('note', value)}
          />
          <Input
            type="number"
            min="0"
            value={filters.stockMin}
            placeholder="Ост. от"
            onChange={(value) => onFilterChange('stockMin', value)}
          />
          <Input
            type="number"
            min="0"
            value={filters.stockMax}
            placeholder="Ост. до"
            onChange={(value) => onFilterChange('stockMax', value)}
          />
          <button
            type="button"
            onClick={onResetFilters}
            className="h-9 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:border-ocean hover:text-ocean"
          >
            Сбросить
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="p-6 text-sm text-slate-500">Загружаю данные...</div>
      ) : (
        <>
          <div className="max-h-[58vh] overflow-auto">
            <table className="w-full min-w-[1120px] table-fixed border-separate border-spacing-0 text-sm">
              <colgroup>
                <col className="w-[15%]" />
                <col className="w-[12%]" />
                <col className="w-[25%]" />
                <col className="w-[9%]" />
                <col className="w-[8%]" />
                <col className="w-[12%]" />
                <col className="w-[15%]" />
                <col className="w-[4%]" />
              </colgroup>
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#155E75] text-left text-white">
                  <SortableTh field="category" sort={sort} onSort={onSort}>Категория</SortableTh>
                  <SortableTh field="sku" sort={sort} onSort={onSort}>Артикул</SortableTh>
                  <SortableTh field="name" sort={sort} onSort={onSort}>Название</SortableTh>
                  <SortableTh field="price" sort={sort} onSort={onSort}>Цена</SortableTh>
                  <SortableTh field="stock" sort={sort} onSort={onSort}>Остаток</SortableTh>
                  <SortableTh field="date" sort={sort} onSort={onSort}>Дата</SortableTh>
                  <SortableTh field="note" sort={sort} onSort={onSort}>Примечание</SortableTh>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {pageItems.map(({ product, index }) => (
                  <ProductRow
                    key={`${index}-${product.sku}`}
                    product={product}
                    index={index}
                    categories={categories}
                    productNames={productNames}
                    isMenuOpen={openMenuIndex === index}
                    onMenuToggle={() => onMenuToggle(index)}
                    onChange={onUpdate}
                    onDuplicate={onDuplicate}
                    onRemove={onRemove}
                    canRemove={canRemove}
                  />
                ))}
              </tbody>
            </table>
            {totalFiltered === 0 && (
              <div className="border-t border-slate-100 p-6 text-sm text-slate-500">
                Нет товаров по текущим фильтрам.
              </div>
            )}
          </div>
          <Pagination
            page={page}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </>
      )}
    </section>
  );
}

function Pagination({ page, pageSize, pageSizeOptions, totalPages, onPageChange, onPageSizeChange }) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>На странице</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-9 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:border-ocean hover:text-ocean disabled:cursor-not-allowed disabled:opacity-40"
        >
          Назад
        </button>
        <span className="min-w-[92px] text-center text-sm text-slate-600">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-9 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:border-ocean hover:text-ocean disabled:cursor-not-allowed disabled:opacity-40"
        >
          Вперед
        </button>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  index,
  categories,
  productNames,
  isMenuOpen,
  onMenuToggle,
  onChange,
  onDuplicate,
  onRemove,
  canRemove,
}) {
  const stock = Number(product.stock);
  const stockClass =
    stock < 10
      ? 'border-red-200 bg-red-50 text-red-700'
      : stock > 100
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-slate-200 bg-white text-slate-900';

  return (
    <tr>
      <Td>
        <Select value={product.category} onChange={(value) => onChange(index, 'category', value)}>
          <option value="">Без категории</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </Td>
      <Td>
        <Input value={product.sku} onChange={(value) => onChange(index, 'sku', value)} />
      </Td>
      <Td>
        <Select value={product.name} onChange={(value) => onChange(index, 'name', value)}>
          <option value="">Без названия</option>
          {productNames.map((productName) => (
            <option key={productName} value={productName}>
              {productName}
            </option>
          ))}
        </Select>
      </Td>
      <Td>
        <Input
          type="number"
          min="0"
          value={product.price}
          onChange={(value) => onChange(index, 'price', Number(value))}
        />
      </Td>
      <Td>
        <Input
          className={stockClass}
          type="number"
          min="0"
          value={product.stock}
          onChange={(value) => onChange(index, 'stock', Number(value))}
        />
      </Td>
      <Td>
        <Input type="date" value={product.date} onChange={(value) => onChange(index, 'date', value)} />
      </Td>
      <Td>
        <Textarea value={product.note} onChange={(value) => onChange(index, 'note', value)} />
      </Td>
      <Td>
        <div className="relative flex justify-end">
          <button
            type="button"
            onClick={onMenuToggle}
            title="Действия"
            className="h-9 w-9 rounded-md border border-slate-200 text-slate-600 transition hover:border-ocean hover:text-ocean"
          >
            ...
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-10 z-20 w-36 rounded-md border border-slate-200 bg-white p-1 shadow-lg">
              <button
                type="button"
                onClick={() => onDuplicate(index)}
                className="block h-9 w-full rounded px-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                Копировать
              </button>
              <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={!canRemove}
                className="block h-9 w-full rounded px-3 text-left text-sm text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      </Td>
    </tr>
  );
}

function SortableTh({ field, sort, onSort, children }) {
  const isActive = sort.field === field;
  return (
    <th className="border-r border-white/20 px-2.5 py-2.5 text-sm font-semibold">
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span>{children}</span>
        <span className="text-xs opacity-80">{isActive ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
      </button>
    </th>
  );
}

function Th({ children }) {
  return <th className="border-r border-white/20 px-2.5 py-2.5 text-sm font-semibold">{children}</th>;
}

function Td({ children }) {
  return <td className="border-b border-slate-100 px-2 py-2 align-middle">{children}</td>;
}

window.ProductTable = ProductTable;
