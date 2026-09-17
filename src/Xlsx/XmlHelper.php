<?php

declare(strict_types=1);

namespace NanoGadgets\Xlsx;

use InvalidArgumentException;

final class XmlHelper
{
    public static function header(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n";
    }

    /**
     * @param array<int, string> $cells
     */
    public static function row(int $number, array $cells, ?int $height = null): string
    {
        $heightAttribute = $height === null ? '' : ' ht="' . $height . '" customHeight="1"';

        return '<row r="' . $number . '"' . $heightAttribute . '>' . implode('', $cells) . '</row>';
    }

    public static function inlineCell(string $ref, string $value, int $style): string
    {
        return '<c r="' . $ref . '" s="' . $style . '" t="inlineStr"><is><t>' . self::escape($value) . '</t></is></c>';
    }

    public static function numberCell(string $ref, int|float $value, int $style): string
    {
        return '<c r="' . $ref . '" s="' . $style . '"><v>' . $value . '</v></c>';
    }

    public static function cellRef(int $columnNumber, int $rowNumber): string
    {
        $letters = '';
        while ($columnNumber > 0) {
            $columnNumber--;
            $letters = chr(65 + ($columnNumber % 26)) . $letters;
            $columnNumber = intdiv($columnNumber, 26);
        }

        return $letters . $rowNumber;
    }

    public static function excelDate(string $date): int
    {
        $timestamp = strtotime($date . ' 00:00:00 UTC');
        if ($timestamp === false) {
            throw new InvalidArgumentException("Invalid date: {$date}");
        }

        return (int) floor($timestamp / 86400) + 25569;
    }

    public static function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_COMPAT, 'UTF-8');
    }
}
