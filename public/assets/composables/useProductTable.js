const defaultFilters = {
  category: '',
  sku: '',
  name: '',
  note: '',
  stockMin: '',
  stockMax: '',
};

const pageSizeOptions = [10, 20, 50];

function useProductTable(products) {
  const { useEffect, useMemo, useState } = React;
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState({ field: 'name', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredProducts = useMemo(() => {
    const textMatches = (value, query) =>
      String(value || '').toLowerCase().includes(String(query || '').trim().toLowerCase());
    const minStock = filters.stockMin === '' ? null : Number(filters.stockMin);
    const maxStock = filters.stockMax === '' ? null : Number(filters.stockMax);

    return products
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => {
        const stock = Number(product.stock || 0);

        return (
          (!filters.category || product.category === filters.category) &&
          textMatches(product.sku, filters.sku) &&
          textMatches(product.name, filters.name) &&
          textMatches(product.note, filters.note) &&
          (minStock === null || stock >= minStock) &&
          (maxStock === null || stock <= maxStock)
        );
      })
      .sort((left, right) => {
        const leftValue = left.product[sort.field] ?? '';
        const rightValue = right.product[sort.field] ?? '';
        const multiplier = sort.direction === 'asc' ? 1 : -1;

        if (['price', 'stock'].includes(sort.field)) {
          return (Number(leftValue || 0) - Number(rightValue || 0)) * multiplier;
        }

        return String(leftValue).localeCompare(String(rightValue), 'ru', {
          numeric: true,
          sensitivity: 'base',
        }) * multiplier;
      });
  }, [filters, products, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [filters, pageSize, sort]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetFilters() {
    setFilters(defaultFilters);
  }

  function toggleSort(field) {
    setSort((current) => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  function changePage(nextPage) {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  }

  function changePageSize(nextPageSize) {
    setPageSize(nextPageSize);
  }

  return {
    changePage,
    changePageSize,
    filters,
    page,
    pageItems,
    pageSize,
    pageSizeOptions,
    resetFilters,
    sort,
    toggleSort,
    totalFiltered: filteredProducts.length,
    totalPages,
    updateFilter,
  };
}

window.useProductTable = useProductTable;
