function CategorySidebar({
  categories,
  newCategory,
  onAddCategory,
  onAddProduct,
  onNewCategoryChange,
  onRemoveCategory,
}) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">Категории</h2>
        <span className="rounded-full bg-mint px-2.5 py-1 text-xs font-semibold text-ocean">
          {categories.length}
        </span>
      </div>

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

      <div className="mt-3 flex max-h-[46vh] flex-col gap-2 overflow-y-auto pr-1">
        {categories.map((category) => (
          <div
            key={category}
            className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            <span className="min-w-0 truncate">{category}</span>
            <button
              type="button"
              onClick={() => onRemoveCategory(category)}
              title="Удалить категорию"
              className="h-7 w-7 shrink-0 rounded-md text-slate-500 transition hover:bg-white hover:text-red-700"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddProduct}
        className="mt-4 flex h-10 w-full items-center justify-center rounded-md border border-ocean bg-white text-sm font-semibold text-ocean transition hover:bg-mint"
      >
        Добавить товар
      </button>
    </aside>
  );
}

window.CategorySidebar = CategorySidebar;
