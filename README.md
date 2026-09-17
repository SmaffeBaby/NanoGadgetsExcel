# NanoGadgets Inventory Report

English | [Русский](README.ru.md)

## Project Overview

NanoGadgets Inventory Report is a small PHP and React application for managing an electronics assortment and generating an Excel inventory report.

The project started as a PHP test assignment: create a generated `.xlsx` report for a fictional company, NanoGadgets, which sells small high-tech products such as smart rings and mini projectors. On top of the original assignment, the project now includes a browser-based inventory editor, SQLite persistence, dictionaries for categories and product names, filters, sorting, pagination, and manual save/discard controls.

## What The Project Contains

```text
.
├── generate_report.php                 # CLI script that generates an XLSX report from sample data
├── output/
│   └── NanoGadgets_report.xlsx          # Generated report example
├── data/
│   └── inventory.sqlite                 # Local SQLite database, created automatically
├── public/
│   ├── index.html                       # Browser entry point
│   ├── api/
│   │   ├── download-xlsx.php            # Generates and downloads the XLSX report
│   │   └── inventory.php                # JSON API for products, categories, and product names
│   └── assets/
│       ├── app.jsx                      # Thin React app composition layer
│       ├── components/                  # React UI components
│       └── composables/                 # React state/business logic hooks
└── src/
    ├── Data/                            # Initial sample products
    ├── Report/                          # Report generation and product normalization
    ├── Storage/                         # SQLite repository
    ├── Xlsx/                            # Low-level XLSX package/XML builders
    └── bootstrap.php                    # Lightweight PSR-like autoloader
```

## Requirements

- PHP 8.1 or newer.
- PHP extensions: `pdo_sqlite`, `zip`, `xml`, `mbstring`.
- A browser with internet access for the UI CDN scripts:
  - React 18
  - ReactDOM 18
  - Babel Standalone
  - Tailwind CDN

No Composer or npm install step is required.

## How To Run After Unpacking The Archive

1. Unpack the archive.

2. Open a terminal in the project directory:

   ```bash
   cd NanoGadgets
   ```

3. Start the local PHP server:

   ```bash
   php -S 127.0.0.1:8000 -t public
   ```

4. Open the application:

   ```text
   http://127.0.0.1:8000/
   ```

5. Use the UI to edit dictionaries and assortment rows. When changes appear, confirm them with `Save changes? Yes` or discard them with `No`.

6. Download the Excel report with the `Download XLSX` button.

You can also generate the original report from sample data without the browser:

```bash
php generate_report.php
```

Or choose a custom output path:

```bash
php generate_report.php output/custom_report.xlsx
```

## What PHP Does

PHP is responsible for the backend and report generation:

- Serves JSON API endpoints from `public/api`.
- Stores and loads data through SQLite.
- Validates products before XLSX generation.
- Builds the Excel workbook manually as an OpenXML `.xlsx` package.
- Applies report formatting, filters, and conditional formatting.

Main PHP parts:

- `src/Storage/InventoryRepository.php` creates and manages the SQLite tables.
- `src/Report/ProductNormalizer.php` validates and normalizes product rows.
- `src/Report/InventoryReportGenerator.php` coordinates report generation.
- `src/Report/InventoryWorksheet.php` builds the worksheet content.
- `src/Xlsx/*` creates the XLSX ZIP package and XML files.

## What React Does

React powers the browser UI:

- Product assortment editing.
- Category and product-name dictionaries.
- Inline editing for dictionaries.
- Collapsible dictionary section.
- Product add modal.
- Sorting, filtering, and pagination.
- Manual save/discard workflow.
- XLSX download action.

The React app is intentionally split:

- `public/assets/app.jsx` only composes the page.
- `public/assets/composables/useInventory.js` contains inventory state, persistence, and dictionary actions.
- `public/assets/composables/useProductTable.js` contains filtering, sorting, and pagination logic.
- `public/assets/components/*` contains reusable UI components.

## Database Setup

The project uses SQLite.

The database file is:

```text
data/inventory.sqlite
```

It is created automatically on the first request to:

```text
GET /api/inventory.php
```

The database stores:

- categories;
- product-name dictionary values;
- product assortment rows.

If the database is empty, it is seeded from:

```text
src/Data/SampleProducts.php
```

The SQLite file is local runtime data and is ignored by Git through:

```text
data/.gitignore
```

## Original Test Assignment

The provided assignment was for a PHP developer position at IndigoSoft Digital Technologies.

The task:

- Imagine developing a report for NanoGadgets, a company that sells small high-tech goods.
- Create 8-10 product types with fields:
  - SKU;
  - name;
  - category, 3-4 variants;
  - price from 1,000 to 50,000 RUB;
  - stock from 0 to 200;
  - delivery date within 2025.
- Create an Excel file:
  - worksheet `Assortment`;
  - full product table;
  - category filter;
  - conditional formatting:
    - stock `< 10` is red;
    - stock `> 100` is green.
- Provide an archive containing the script and generated file.

## Added Features Beyond The Assignment

On top of the original report-generation task, the project now includes:

- Browser-based inventory management UI.
- SQLite persistence after page reload.
- Editable category dictionary.
- Editable product-name dictionary.
- Collapsible dictionaries section.
- Dictionary search for categories and products.
- Product add modal.
- Product name selection from a dropdown.
- Category selection from a dropdown.
- Editable assortment table.
- Textarea notes.
- Row actions menu with copy/delete.
- Manual save/discard workflow instead of autosave.
- Sorting by table columns.
- Filters by category, SKU, product name, note, and stock range.
- Pagination with 10/20/50 rows per page.
- XLSX download from the current UI data.
