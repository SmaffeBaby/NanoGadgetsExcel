<?php

declare(strict_types=1);

namespace NanoGadgets\Report;

use InvalidArgumentException;

final class ProductNormalizer
{
    /**
     * @param array<mixed> $items
     * @return array<int, array<string, string|int>>
     */
    public static function normalize(array $items): array
    {
        if ($items === []) {
            throw new InvalidArgumentException('Добавьте хотя бы один товар.');
        }

        $products = [];

        foreach ($items as $index => $item) {
            if (!is_array($item)) {
                throw new InvalidArgumentException('Некорректная строка товара.');
            }

            $row = $index + 1;
            $category = self::stringValue($item, 'category');
            $sku = self::stringValue($item, 'sku');
            $name = self::stringValue($item, 'name');
            $unit = self::stringValue($item, 'unit', 'Штука');
            $note = self::stringValue($item, 'note', '');
            $price = self::intValue($item, 'price');
            $stock = self::intValue($item, 'stock');
            $date = self::dateValue($item, 'date');

            if ($category === '' || $sku === '' || $name === '') {
                throw new InvalidArgumentException("Заполните категорию, артикул и название в строке {$row}.");
            }

            if ($price < 1000 || $price > 50000) {
                throw new InvalidArgumentException("Цена в строке {$row} должна быть от 1000 до 50000.");
            }

            if ($stock < 0 || $stock > 200) {
                throw new InvalidArgumentException("Остаток в строке {$row} должен быть от 0 до 200.");
            }

            $products[] = [
                'category' => $category,
                'sku' => $sku,
                'name' => $name,
                'price' => $price,
                'stock' => $stock,
                'date' => $date,
                'unit' => $unit === '' ? 'Штука' : $unit,
                'note' => $note,
            ];
        }

        return $products;
    }

    /**
     * @param array<string, mixed> $item
     */
    private static function stringValue(array $item, string $key, string $default = ''): string
    {
        $value = $item[$key] ?? $default;

        return trim((string) $value);
    }

    /**
     * @param array<string, mixed> $item
     */
    private static function intValue(array $item, string $key): int
    {
        $value = $item[$key] ?? null;

        if (!is_numeric($value)) {
            return -1;
        }

        return (int) $value;
    }

    /**
     * @param array<string, mixed> $item
     */
    private static function dateValue(array $item, string $key): string
    {
        $value = trim((string) ($item[$key] ?? ''));
        $timestamp = strtotime($value . ' 00:00:00 UTC');

        if ($timestamp === false || gmdate('Y', $timestamp) !== '2025') {
            throw new InvalidArgumentException('Дата поставки должна быть в пределах 2025 года.');
        }

        return gmdate('Y-m-d', $timestamp);
    }
}
