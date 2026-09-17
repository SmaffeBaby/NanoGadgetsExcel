<?php

declare(strict_types=1);

require __DIR__ . '/../../src/bootstrap.php';

use NanoGadgets\Data\SampleProducts;
use NanoGadgets\Report\InventoryReportGenerator;
use NanoGadgets\Report\ProductNormalizer;

try {
    $payload = json_decode(file_get_contents('php://input') ?: '[]', true, 512, JSON_THROW_ON_ERROR);
    $rawProducts = is_array($payload) && isset($payload['products']) && is_array($payload['products'])
        ? $payload['products']
        : SampleProducts::all();
    $products = ProductNormalizer::normalize($rawProducts);

    $tempFile = tempnam(sys_get_temp_dir(), 'nanogadgets_');
    if ($tempFile === false) {
        throw new RuntimeException('Не удалось создать временный файл.');
    }

    $xlsxPath = $tempFile . '.xlsx';
    (new InventoryReportGenerator($products))->generate($xlsxPath);

    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment; filename="NanoGadgets_report.xlsx"');
    header('Content-Length: ' . filesize($xlsxPath));
    header('Cache-Control: no-store');

    readfile($xlsxPath);
    unlink($xlsxPath);
    unlink($tempFile);
} catch (Throwable $exception) {
    http_response_code(422);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => $exception->getMessage()], JSON_UNESCAPED_UNICODE);
}
