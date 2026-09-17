function App() {
  const inventory = useInventory();
  const table = useProductTable(inventory.products);

  return (
    <main className="mx-auto flex min-h-screen max-w-[1500px] flex-col gap-4 px-4 py-4 sm:px-5">
      <HeaderSummary
        error={inventory.error}
        isDownloading={inventory.isDownloading}
        isDirty={inventory.isDirty}
        isLoading={inventory.isLoading}
        isSaving={inventory.isSaving}
        metrics={inventory.metrics}
        onDiscard={inventory.discardChanges}
        onDownload={inventory.downloadReport}
        onSave={inventory.saveChanges}
      />

      <section className="grid min-h-0 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <CategorySidebar
          categories={inventory.categories}
          newCategory={inventory.newCategory}
          onAddCategory={inventory.addCategory}
          onAddProduct={inventory.addProduct}
          onNewCategoryChange={inventory.setNewCategory}
          onRemoveCategory={inventory.removeCategory}
        />

        <ProductTable
          canRemove={inventory.products.length > 1}
          categories={inventory.categories}
          filters={table.filters}
          isLoading={inventory.isLoading}
          onDuplicate={inventory.duplicateProduct}
          onFilterChange={table.updateFilter}
          onMenuToggle={inventory.toggleMenu}
          onPageChange={table.changePage}
          onPageSizeChange={table.changePageSize}
          onRemove={inventory.removeProduct}
          onResetFilters={table.resetFilters}
          onSort={table.toggleSort}
          onUpdate={inventory.updateProduct}
          openMenuIndex={inventory.openMenuIndex}
          page={table.page}
          pageItems={table.pageItems}
          pageSize={table.pageSize}
          pageSizeOptions={table.pageSizeOptions}
          productsCount={inventory.products.length}
          sort={table.sort}
          totalFiltered={table.totalFiltered}
          totalPages={table.totalPages}
        />
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
