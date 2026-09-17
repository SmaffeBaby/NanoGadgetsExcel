<?php

declare(strict_types=1);

namespace NanoGadgets\Storage;

use NanoGadgets\Data\SampleProducts;
use PDO;

final class InventoryRepository
{
    private PDO $pdo;

    public function __construct(string $databasePath)
    {
        $directory = dirname($databasePath);
        if (!is_dir($directory)) {
            mkdir($directory, 0775, true);
        }

        $this->pdo = new PDO('sqlite:' . $databasePath);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->initialize();
    }

    /**
     * @return array{categories: array<int, string>, productNames: array<int, string>, products: array<int, array<string, mixed>>}
     */
    public function all(): array
    {
        $this->seedIfEmpty();
        $this->seedProductNamesIfEmpty();

        return [
            'categories' => $this->categories(),
            'productNames' => $this->productNames(),
            'products' => $this->products(),
        ];
    }

    /**
     * @param array<int, string> $categories
     * @param array<int, string> $productNames
     * @param array<int, array<string, mixed>> $products
     */
    public function save(array $categories, array $productNames, array $products): void
    {
        $this->pdo->beginTransaction();

        try {
            $normalizedCategories = [];
            foreach ($categories as $category) {
                $category = trim((string) $category);
                if ($category !== '' && !in_array($category, $normalizedCategories, true)) {
                    $normalizedCategories[] = $category;
                }
            }

            foreach ($products as $product) {
                $category = trim((string) ($product['category'] ?? ''));
                if ($category !== '' && !in_array($category, $normalizedCategories, true)) {
                    $normalizedCategories[] = $category;
                }
            }

            $normalizedProductNames = [];
            foreach ($productNames as $productName) {
                $productName = trim((string) $productName);
                if ($productName !== '' && !in_array($productName, $normalizedProductNames, true)) {
                    $normalizedProductNames[] = $productName;
                }
            }

            foreach ($products as $product) {
                $productName = trim((string) ($product['name'] ?? ''));
                if ($productName !== '' && !in_array($productName, $normalizedProductNames, true)) {
                    $normalizedProductNames[] = $productName;
                }
            }

            $this->pdo->exec('DELETE FROM products');
            $this->pdo->exec('DELETE FROM categories');
            $this->pdo->exec('DELETE FROM product_names');

            $categoryStatement = $this->pdo->prepare(
                'INSERT INTO categories (name, position) VALUES (:name, :position)'
            );
            foreach ($normalizedCategories as $position => $category) {
                $categoryStatement->execute([
                    ':name' => $category,
                    ':position' => $position,
                ]);
            }

            $productNameStatement = $this->pdo->prepare(
                'INSERT INTO product_names (name, position) VALUES (:name, :position)'
            );
            foreach ($normalizedProductNames as $position => $productName) {
                $productNameStatement->execute([
                    ':name' => $productName,
                    ':position' => $position,
                ]);
            }

            $productStatement = $this->pdo->prepare(
                'INSERT INTO products (category, sku, name, price, stock, date, unit, note, position)
                 VALUES (:category, :sku, :name, :price, :stock, :date, :unit, :note, :position)'
            );
            foreach ($products as $position => $product) {
                $productStatement->execute([
                    ':category' => trim((string) ($product['category'] ?? '')),
                    ':sku' => trim((string) ($product['sku'] ?? '')),
                    ':name' => trim((string) ($product['name'] ?? '')),
                    ':price' => max(0, (int) ($product['price'] ?? 0)),
                    ':stock' => max(0, (int) ($product['stock'] ?? 0)),
                    ':date' => trim((string) ($product['date'] ?? '')),
                    ':unit' => trim((string) ($product['unit'] ?? 'Штука')),
                    ':note' => trim((string) ($product['note'] ?? '')),
                    ':position' => $position,
                ]);
            }

            $this->pdo->commit();
        } catch (\Throwable $exception) {
            $this->pdo->rollBack();
            throw $exception;
        }
    }

    private function initialize(): void
    {
        $this->pdo->exec(
            'CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                position INTEGER NOT NULL DEFAULT 0
            )'
        );

        $this->pdo->exec(
            'CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL DEFAULT "",
                sku TEXT NOT NULL DEFAULT "",
                name TEXT NOT NULL DEFAULT "",
                price INTEGER NOT NULL DEFAULT 0,
                stock INTEGER NOT NULL DEFAULT 0,
                date TEXT NOT NULL DEFAULT "",
                unit TEXT NOT NULL DEFAULT "Штука",
                note TEXT NOT NULL DEFAULT "",
                position INTEGER NOT NULL DEFAULT 0
            )'
        );

        $this->pdo->exec(
            'CREATE TABLE IF NOT EXISTS product_names (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                position INTEGER NOT NULL DEFAULT 0
            )'
        );
    }

    private function seedIfEmpty(): void
    {
        $count = (int) $this->pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
        if ($count > 0) {
            return;
        }

        $products = SampleProducts::all();
        $categories = array_values(array_unique(array_map(
            static fn (array $product): string => (string) $product['category'],
            $products
        )));
        $productNames = array_values(array_unique(array_map(
            static fn (array $product): string => (string) $product['name'],
            $products
        )));

        $this->save($categories, $productNames, $products);
    }

    private function seedProductNamesIfEmpty(): void
    {
        $count = (int) $this->pdo->query('SELECT COUNT(*) FROM product_names')->fetchColumn();
        if ($count > 0) {
            return;
        }

        $rows = $this->pdo
            ->query('SELECT DISTINCT name FROM products WHERE name <> "" ORDER BY position ASC, id ASC')
            ->fetchAll();
        $statement = $this->pdo->prepare(
            'INSERT INTO product_names (name, position) VALUES (:name, :position)'
        );

        foreach ($rows as $position => $row) {
            $statement->execute([
                ':name' => (string) $row['name'],
                ':position' => $position,
            ]);
        }
    }

    /**
     * @return array<int, string>
     */
    private function productNames(): array
    {
        $rows = $this->pdo
            ->query('SELECT name FROM product_names ORDER BY position ASC, name ASC')
            ->fetchAll();

        return array_map(static fn (array $row): string => (string) $row['name'], $rows);
    }

    /**
     * @return array<int, string>
     */
    private function categories(): array
    {
        $rows = $this->pdo
            ->query('SELECT name FROM categories ORDER BY position ASC, name ASC')
            ->fetchAll();

        return array_map(static fn (array $row): string => (string) $row['name'], $rows);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function products(): array
    {
        $rows = $this->pdo
            ->query('SELECT category, sku, name, price, stock, date, unit, note FROM products ORDER BY position ASC, id ASC')
            ->fetchAll();

        return array_map(
            static fn (array $row): array => [
                'category' => (string) $row['category'],
                'sku' => (string) $row['sku'],
                'name' => (string) $row['name'],
                'price' => (int) $row['price'],
                'stock' => (int) $row['stock'],
                'date' => (string) $row['date'],
                'unit' => (string) $row['unit'],
                'note' => (string) $row['note'],
            ],
            $rows
        );
    }
}
