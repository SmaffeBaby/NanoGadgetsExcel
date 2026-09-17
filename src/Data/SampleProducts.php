<?php

declare(strict_types=1);

namespace NanoGadgets\Data;

final class SampleProducts
{
    /**
     * @return array<int, array<string, string|int>>
     */
    public static function all(): array
    {
        return [
            [
                'category' => 'Умные кольца',
                'sku' => 'NG-RNG-001',
                'name' => 'Кольцо-трекер пульса SmartRing Pro',
                'price' => 18990,
                'stock' => 7,
                'date' => '2025-10-10',
                'unit' => 'Штука',
                'note' => 'Критический остаток',
            ],
            [
                'category' => 'Мини-проекторы',
                'sku' => 'NG-PRJ-014',
                'name' => 'Карманный проектор PocketBeam Air',
                'price' => 34990,
                'stock' => 46,
                'date' => '2025-05-22',
                'unit' => 'Штука',
                'note' => 'Ходовой товар',
            ],
            [
                'category' => 'Носимые гаджеты',
                'sku' => 'NG-WCH-027',
                'name' => 'Фитнес-браслет PulseBand Lite',
                'price' => 5990,
                'stock' => 138,
                'date' => '2025-02-18',
                'unit' => 'Штука',
                'note' => 'Запас достаточный',
            ],
            [
                'category' => 'Умный дом',
                'sku' => 'NG-HUB-009',
                'name' => 'Мини-хаб управления HomeDot Mini',
                'price' => 11990,
                'stock' => 103,
                'date' => '2025-08-04',
                'unit' => 'Штука',
                'note' => 'Запас достаточный',
            ],
            [
                'category' => 'Зарядные устройства',
                'sku' => 'NG-CHG-033',
                'name' => 'Магнитная док-станция MagDock Trio',
                'price' => 7990,
                'stock' => 22,
                'date' => '2025-04-11',
                'unit' => 'Штука',
                'note' => 'Плановая поставка',
            ],
            [
                'category' => 'Мини-проекторы',
                'sku' => 'NG-PRJ-018',
                'name' => 'Проектор-куб NanoCinema Cube',
                'price' => 47990,
                'stock' => 4,
                'date' => '2025-11-28',
                'unit' => 'Штука',
                'note' => 'Срочно заказать',
            ],
            [
                'category' => 'Умные кольца',
                'sku' => 'NG-RNG-006',
                'name' => 'Кольцо NFC-ключ AccessRing One',
                'price' => 12990,
                'stock' => 74,
                'date' => '2025-06-16',
                'unit' => 'Штука',
                'note' => 'Новинка',
            ],
            [
                'category' => 'Носимые гаджеты',
                'sku' => 'NG-GLS-021',
                'name' => 'Умные очки NotifyGlass S',
                'price' => 28990,
                'stock' => 118,
                'date' => '2025-09-02',
                'unit' => 'Штука',
                'note' => 'Запас достаточный',
            ],
            [
                'category' => 'Умный дом',
                'sku' => 'NG-SNS-040',
                'name' => 'Датчик качества воздуха AirSense Micro',
                'price' => 9990,
                'stock' => 0,
                'date' => '2025-12-05',
                'unit' => 'Штука',
                'note' => 'Нет на складе',
            ],
            [
                'category' => 'Зарядные устройства',
                'sku' => 'NG-PWR-052',
                'name' => 'Компактный пауэрбанк SlimVolt 10000',
                'price' => 4490,
                'stock' => 167,
                'date' => '2025-03-07',
                'unit' => 'Штука',
                'note' => 'Запас достаточный',
            ],
        ];
    }
}
