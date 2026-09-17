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
  const [error, setError] = useState('');
  const didLoad = useRef(false);

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

  useEffect(() => {
    if (!didLoad.current) {
      return;
    }

    const timeout = window.setTimeout(() => {
      saveInventory(categories, products);
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [categories, products]);

  async function loadInventory() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/inventory.php');
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Не удалось загрузить данные.');
      }

      setCategories(payload.categories || []);
      setProducts(payload.products?.length ? payload.products : [{ ...emptyProduct }]);
      didLoad.current = true;
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
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  function updateProduct(index, field, value) {
    setProducts((current) =>
      current.map((product, productIndex) =>
        productIndex === index ? { ...product, [field]: value } : product,
      ),
    );
  }

  function addProduct() {
    setProducts((current) => [
      ...current,
      { ...emptyProduct, category: visibleCategories[0] || '' },
    ]);
  }

  function duplicateProduct(index) {
    setProducts((current) => {
      const copy = { ...current[index], sku: current[index].sku ? `${current[index].sku}-COPY` : '' };
      return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)];
    });
    setOpenMenuIndex(null);
  }

  function removeProduct(index) {
    setProducts((current) => current.filter((_, productIndex) => productIndex !== index));
    setOpenMenuIndex(null);
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
  }

  function removeCategory(category) {
    setCategories((current) => current.filter((item) => item !== category));
    setProducts((current) =>
      current.map((product) => (product.category === category ? { ...product, category: '' } : product)),
    );
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
    downloadReport,
    duplicateProduct,
    error,
    isDownloading,
    isLoading,
    isSaving,
    metrics,
    newCategory,
    openMenuIndex,
    products,
    removeCategory,
    removeProduct,
    setNewCategory,
    toggleMenu,
    updateProduct,
  };
}

window.useInventory = useInventory;
