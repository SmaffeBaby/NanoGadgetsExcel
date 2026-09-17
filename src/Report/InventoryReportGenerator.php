<?php

declare(strict_types=1);

namespace NanoGadgets\Report;

use NanoGadgets\Xlsx\WorkbookMetadataXml;
use NanoGadgets\Xlsx\XlsxPackage;
use RuntimeException;
use ZipArchive;

final class InventoryReportGenerator
{
    /**
     * @param array<int, array<string, string|int>> $products
     */
    public function __construct(private readonly array $products)
    {
    }

    public function generate(string $outputPath): void
    {
        $directory = dirname($outputPath);
        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new RuntimeException("Cannot create directory: {$directory}");
        }

        $zip = new ZipArchive();
        if ($zip->open($outputPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new RuntimeException("Cannot write XLSX file: {$outputPath}");
        }

        $package = new XlsxPackage(
            new InventoryWorksheet($this->products),
            new WorkbookMetadataXml()
        );

        foreach ($package->files() as $path => $xml) {
            $zip->addFromString($path, $xml);
        }

        $zip->close();
    }
}
