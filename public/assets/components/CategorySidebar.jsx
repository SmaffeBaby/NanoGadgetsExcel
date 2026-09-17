function CategorySidebar({
  categories,
  isProductFormOpen,
  newCategory,
  newProductName,
  onAddCategory,
  onAddProductName,
  onCloseProductForm,
  onNewCategoryChange,
  onNewProductNameChange,
  onProductFormChange,
  onRemoveCategory,
  onRemoveProductName,
  onRenameCategory,
  onRenameProductName,
  onSubmitProductForm,
  productForm,
  productNames,
}) {
  const [categorySearch, setCategorySearch] = React.useState('');
  const [productSearch, setProductSearch] = React.useState('');
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const filteredCategories = filterList(categories, categorySearch);
  const filteredProductNames = filterList(productNames, productSearch);

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">Справочники</h2>
          <p className="mt-1 text-xs text-slate-500">
            Категории: {categories.length}, товары: {productNames.length}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed((current) => !current)}
          className="h-9 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:border-ocean hover:text-ocean"
        >
          {isCollapsed ? 'Развернуть' : 'Свернуть'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <SidebarPanel count={categories.length} title="Категории">
            <form onSubmit={onAddCategory} className="mt-3 flex gap-2">
              <Input
                value={newCategory}
                placeholder="Новая категория"
                onChange={onNewCategoryChange}
              />
              <button
                type="submit"
                className="h-10 shrink-0 rounded-md bg-ocean px-3 text-sm font-semibold text-white transition hover:bg-[#0B5966]"
              >
                +
              </button>
            </form>

            <div className="mt-3">
              <Input
                value={categorySearch}
                placeholder="Поиск категории"
                onChange={setCategorySearch}
              />
            </div>

            <div className="mt-3 flex max-h-[28vh] flex-col gap-2 overflow-y-auto pr-1">
              {filteredCategories.map((category) => (
                <ListItem
                  key={category}
                  label={category}
                  title="Удалить категорию"
                  onRemove={() => onRemoveCategory(category)}
                  onRename={(value) => onRenameCategory(category, value)}
                />
              ))}
              {filteredCategories.length === 0 && (
                <EmptyListMessage>Категории не найдены.</EmptyListMessage>
              )}
            </div>
          </SidebarPanel>

          <SidebarPanel count={productNames.length} title="Товар">
            <form onSubmit={onAddProductName} className="mt-3 flex gap-2">
              <Input
                value={newProductName}
                placeholder="Новый товар"
                onChange={onNewProductNameChange}
              />
              <button
                type="submit"
                className="h-10 shrink-0 rounded-md bg-ocean px-3 text-sm font-semibold text-white transition hover:bg-[#0B5966]"
              >
                +
              </button>
            </form>

            <div className="mt-3">
              <Input
                value={productSearch}
                placeholder="Поиск товара"
                onChange={setProductSearch}
              />
            </div>

            <div className="mt-3 flex max-h-[28vh] flex-col gap-2 overflow-y-auto pr-1">
              {filteredProductNames.map((productName) => (
                <ListItem
                  key={productName}
                  label={productName}
                  title="Удалить товар"
                  onRemove={() => onRemoveProductName(productName)}
                  onRename={(value) => onRenameProductName(productName, value)}
                />
              ))}
              {filteredProductNames.length === 0 && (
                <EmptyListMessage>Товары не найдены.</EmptyListMessage>
              )}
            </div>
          </SidebarPanel>
        </div>
      )}

      {isProductFormOpen && (
        <ProductFormModal
          categories={categories}
          product={productForm}
          productNames={productNames}
          onChange={onProductFormChange}
          onClose={onCloseProductForm}
          onSubmit={onSubmitProductForm}
        />
      )}
    </aside>
  );
}

function SidebarPanel({ count, title, children }) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <span className="rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-ocean">
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

function ListItem({ label, onRemove, onRename, title }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(label);

  React.useEffect(() => {
    setDraft(label);
  }, [label]);

  function submitRename(event) {
    event.preventDefault();
    onRename(draft);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <form
        onSubmit={submitRename}
        className="flex items-center gap-2 rounded-md border border-ocean/30 bg-white px-2 py-2 text-sm"
      >
        <Input value={draft} onChange={setDraft} />
        <button
          type="submit"
          className="h-8 rounded-md bg-ocean px-2.5 text-xs font-semibold text-white transition hover:bg-[#0B5966]"
        >
          OK
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(label);
            setIsEditing(false);
          }}
          className="h-8 rounded-md border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 transition hover:border-ocean hover:text-ocean"
        >
          Отмена
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
      <span className="min-w-0 truncate">{label}</span>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="h-7 rounded-md px-2 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-ocean"
        >
          Изм.
        </button>
        <button
          type="button"
          onClick={onRemove}
          title={title}
          className="h-7 w-7 rounded-md text-slate-500 transition hover:bg-white hover:text-red-700"
        >
          x
        </button>
      </div>
    </div>
  );
}

function EmptyListMessage({ children }) {
  return (
    <div className="rounded-md border border-dashed border-slate-200 px-3 py-3 text-sm text-slate-500">
      {children}
    </div>
  );
}

function filterList(items, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => item.toLowerCase().includes(normalizedQuery));
}

function ProductFormModal({ categories, product, productNames, onChange, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/35 px-4 py-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-5 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-ink">Добавить товар</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            x
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Категория
            <Select value={product.category} onChange={(value) => onChange('category', value)}>
              <option value="">Без категории</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Название
            <Select value={product.name} onChange={(value) => onChange('name', value)}>
              <option value="">Без названия</option>
              {productNames.map((productName) => (
                <option key={productName} value={productName}>
                  {productName}
                </option>
              ))}
            </Select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Артикул
            <Input value={product.sku} placeholder="Артикул" onChange={(value) => onChange('sku', value)} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Цена
            <Input
              type="number"
              min="0"
              value={product.price}
              placeholder="Цена"
              onChange={(value) => onChange('price', Number(value))}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Остаток
            <Input
              type="number"
              min="0"
              value={product.stock}
              placeholder="Остаток"
              onChange={(value) => onChange('stock', Number(value))}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Дата
            <Input type="date" value={product.date} onChange={(value) => onChange('date', value)} />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Примечание
            <Textarea value={product.note} onChange={(value) => onChange('note', value)} />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-ocean hover:text-ocean"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="h-10 rounded-md bg-ocean px-4 text-sm font-semibold text-white transition hover:bg-[#0B5966]"
          >
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
}

window.CategorySidebar = CategorySidebar;
