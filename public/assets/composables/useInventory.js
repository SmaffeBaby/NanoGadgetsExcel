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
  const [productNames, setProductNames] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [productForm, setProductForm] = useState({ ...emptyProduct });
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState('');
  const savedInventory = useRef({ categories: [], productNames: [], products: [] });

  const visibleCategories = useMemo(
    () => [...new Set(categories.filter(Boolean))],
    [categories],
  );

  const visibleProductNames = useMemo(
    () => [...new Set(productNames.filter(Boolean))],
    [productNames],
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
      const nextProductNames = payload.productNames?.length
        ? payload.productNames
        : namesFromProducts(nextProducts);
      savedInventory.current = cloneInventory(nextCategories, nextProductNames, nextProducts);
      setCategories(nextCategories);
      setProductNames(nextProductNames);
      setProducts(nextProducts);
      setIsDirty(false);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveInventory(nextCategories, nextProductNames, nextProducts) {
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/inventory.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: nextCategories,
          productNames: nextProductNames,
          products: nextProducts,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Не удалось сохранить данные.');
      }

      savedInventory.current = cloneInventory(nextCategories, nextProductNames, nextProducts);
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
    return saveInventory(categories, productNames, products);
  }

  function discardChanges() {
    setCategories(cloneList(savedInventory.current.categories));
    setProductNames(cloneList(savedInventory.current.productNames));
    setProducts(cloneProducts(savedInventory.current.products));
    setNewCategory('');
    setNewProductName('');
    setProductForm({ ...emptyProduct });
    setIsProductFormOpen(false);
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

  function openProductForm() {
    setProductForm({
      ...emptyProduct,
      category: visibleCategories[0] || '',
      name: visibleProductNames[0] || '',
    });
    setIsProductFormOpen(true);
  }

  function closeProductForm() {
    setProductForm({ ...emptyProduct });
    setIsProductFormOpen(false);
  }

  function updateProductForm(field, value) {
    setProductForm((current) => ({ ...current, [field]: value }));
  }

  function submitProductForm(event) {
    event.preventDefault();

    const nextProduct = {
      ...productForm,
      category: productForm.category.trim(),
      sku: productForm.sku.trim(),
      name: productForm.name.trim(),
      price: Number(productForm.price || 0),
      stock: Number(productForm.stock || 0),
      date: productForm.date,
      unit: productForm.unit || 'Штука',
      note: productForm.note.trim(),
    };

    if (!nextProduct.name) {
      setError('Введите название товара.');
      return;
    }

    setProducts((current) => [...current, nextProduct]);
    setProductNames((current) =>
      current.includes(nextProduct.name) ? current : [...current, nextProduct.name],
    );
    closeProductForm();
    setError('');
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

  function addProductName(event) {
    event.preventDefault();
    const productName = newProductName.trim();

    if (!productName || productNames.includes(productName)) {
      setNewProductName('');
      return;
    }

    setProductNames((current) => [...current, productName]);
    setNewProductName('');
    markDirty();
  }

  function removeCategory(category) {
    setCategories((current) => current.filter((item) => item !== category));
    setProducts((current) =>
      current.map((product) => (product.category === category ? { ...product, category: '' } : product)),
    );
    markDirty();
  }

  function renameCategory(oldCategory, nextCategory) {
    const category = nextCategory.trim();
    if (!category || category === oldCategory || categories.includes(category)) {
      return;
    }

    setCategories((current) =>
      current.map((item) => (item === oldCategory ? category : item)),
    );
    setProducts((current) =>
      current.map((product) =>
        product.category === oldCategory ? { ...product, category } : product,
      ),
    );
    markDirty();
  }

  function removeProductName(productName) {
    setProductNames((current) => current.filter((item) => item !== productName));
    setProducts((current) =>
      current.map((product) => (product.name === productName ? { ...product, name: '' } : product)),
    );
    markDirty();
  }

  function renameProductName(oldProductName, nextProductName) {
    const productName = nextProductName.trim();
    if (!productName || productName === oldProductName || productNames.includes(productName)) {
      return;
    }

    setProductNames((current) =>
      current.map((item) => (item === oldProductName ? productName : item)),
    );
    setProducts((current) =>
      current.map((product) =>
        product.name === oldProductName ? { ...product, name: productName } : product,
      ),
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
    addProduct: openProductForm,
    categories: visibleCategories,
    closeProductForm,
    discardChanges,
    downloadReport,
    duplicateProduct,
    error,
    isDownloading,
    isDirty,
    isLoading,
    isProductFormOpen,
    isSaving,
    metrics,
    newCategory,
    newProductName,
    openMenuIndex,
    productForm,
    productNames: visibleProductNames,
    products,
    removeCategory,
    removeProduct,
    removeProductName,
    renameCategory,
    renameProductName,
    saveChanges,
    setNewCategory,
    setNewProductName,
    addProductName,
    submitProductForm,
    toggleMenu,
    updateProduct,
    updateProductForm,
  };
}

function cloneInventory(categories, productNames, products) {
  return {
    categories: cloneList(categories),
    productNames: cloneList(productNames),
    products: cloneProducts(products),
  };
}

function cloneList(items) {
  return [...items];
}

function cloneProducts(products) {
  return products.map((product) => ({ ...product }));
}

function namesFromProducts(products) {
  return [...new Set(products.map((product) => product.name).filter(Boolean))];
}

window.useInventory = useInventory;
