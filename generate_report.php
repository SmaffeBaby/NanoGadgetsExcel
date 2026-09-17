<?php

declare(strict_types=1);

require __DIR__ . '/src/bootstrap.php';

use NanoGadgets\Data\SampleProducts;
use NanoGadgets\Report\InventoryReportGenerator;

$outputPath = $argv[1] ?? __DIR__ . '/output/NanoGadgets_report.xlsx';

(new InventoryReportGenerator(SampleProducts::all()))->generate($outputPath);

echo "Generated: {$outputPath}" . PHP_EOL;
