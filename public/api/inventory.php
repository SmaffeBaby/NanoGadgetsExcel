<?php

declare(strict_types=1);

require __DIR__ . '/../../src/bootstrap.php';

use NanoGadgets\Storage\InventoryRepository;

header('Content-Type: application/json; charset=utf-8');

$repository = new InventoryRepository(__DIR__ . '/../../data/inventory.sqlite');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo json_encode($repository->all(), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $payload = json_decode(file_get_contents('php://input') ?: '{}', true, 512, JSON_THROW_ON_ERROR);
        $categories = isset($payload['categories']) && is_array($payload['categories'])
            ? $payload['categories']
            : [];
        $productNames = isset($payload['productNames']) && is_array($payload['productNames'])
            ? $payload['productNames']
            : [];
        $products = isset($payload['products']) && is_array($payload['products'])
            ? $payload['products']
            : [];

        $repository->save($categories, $productNames, $products);
        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Метод не поддерживается.'], JSON_UNESCAPED_UNICODE);
} catch (Throwable $exception) {
    http_response_code(422);
    echo json_encode(['error' => $exception->getMessage()], JSON_UNESCAPED_UNICODE);
}
