const emptyProduct = {
  category: '',
  sku: '',
  name: '',
  price: 0,
  stock: 0,
  date: '',
  unit: 'Штука',
  note: '',
};

function useInventory() {
  const { useEffect, useMemo, useRef, useState } = React;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState('');
  const savedInventory = useRef({ categories: [], products: [] });

  const visibleCategories = useMemo(
    () => [...new Set(categories.filter(Boolean))],
    [categories],
  );

  const metrics = useMemo(() => ({
    productsCount: products.length,
    totalStock: products.reduce((sum, product) => sum + Number(product.stock || 0), 0),
    totalValue: products.reduce(
      (sum, product) => sum + Number(product.price || 0) * Number(product.stock || 0),
      0,
    ),
    lowStockCount: products.filter((product) => Number(product.stock) < 10).length,
  }), [products]);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/inventory.php');
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Не удалось загрузить данные.');
      }

      const nextCategories = payload.categories || [];
      const nextProducts = payload.products?.length ? payload.products : [{ ...emptyProduct }];
      savedInventory.current = cloneInventory(nextCategories, nextProducts);
      setCategories(nextCategories);
      setProducts(nextProducts);
      setIsDirty(false);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveInventory(nextCategories, nextProducts) {
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/inventory.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: nextCategories, products: nextProducts }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Не удалось сохранить данные.');
      }

      savedInventory.current = cloneInventory(nextCategories, nextProducts);
      setIsDirty(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  function markDirty() {
    setIsDirty(true);
  }

  function saveChanges() {
    return saveInventory(categories, products);
  }

  function discardChanges() {
    setCategories(cloneCategories(savedInventory.current.categories));
    setProducts(cloneProducts(savedInventory.current.products));
    setNewCategory('');
    setOpenMenuIndex(null);
    setError('');
    setIsDirty(false);
  }

  function updateProduct(index, field, value) {
    setProducts((current) =>
      current.map((product, productIndex) =>
        productIndex === index ? { ...product, [field]: value } : product,
      ),
    );
    markDirty();
  }

  function addProduct() {
    setProducts((current) => [
      ...current,
      { ...emptyProduct, category: visibleCategories[0] || '' },
    ]);
    markDirty();
  }

  function duplicateProduct(index) {
    setProducts((current) => {
      const copy = { ...current[index], sku: current[index].sku ? `${current[index].sku}-COPY` : '' };
      return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)];
    });
    setOpenMenuIndex(null);
    markDirty();
  }

  function removeProduct(index) {
    setProducts((current) => current.filter((_, productIndex) => productIndex !== index));
    setOpenMenuIndex(null);
    markDirty();
  }

  function addCategory(event) {
    event.preventDefault();
    const category = newCategory.trim();

    if (!category || categories.includes(category)) {
      setNewCategory('');
      return;
    }

    setCategories((current) => [...current, category]);
    setNewCategory('');
    markDirty();
  }

  function removeCategory(category) {
    setCategories((current) => current.filter((item) => item !== category));
    setProducts((current) =>
      current.map((product) => (product.category === category ? { ...product, category: '' } : product)),
    );
    markDirty();
  }

  function toggleMenu(index) {
    setOpenMenuIndex((current) => (current === index ? null : index));
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

  return {
    addCategory,
    addProduct,
    categories: visibleCategories,
    discardChanges,
    downloadReport,
    duplicateProduct,
    error,
    isDownloading,
    isDirty,
    isLoading,
    isSaving,
    metrics,
    newCategory,
    openMenuIndex,
    products,
    removeCategory,
    removeProduct,
    saveChanges,
    setNewCategory,
    toggleMenu,
    updateProduct,
  };
}

function cloneInventory(categories, products) {
  return {
    categories: cloneCategories(categories),
    products: cloneProducts(products),
  };
}

function cloneCategories(categories) {
  return [...categories];
}

function cloneProducts(products) {
  return products.map((product) => ({ ...product }));
}

window.useInventory = useInventory;
