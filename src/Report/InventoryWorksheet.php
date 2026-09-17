<?php

declare(strict_types=1);

namespace NanoGadgets\Report;

use NanoGadgets\Xlsx\XmlHelper;

final class InventoryWorksheet
{
    public const SHEET_NAME = 'Ассортимент';

    /**
     * @param array<int, array<string, string|int>> $products
     */
    public function __construct(private readonly array $products)
    {
    }

    public function xml(): string
    {
        $generatedAt = date('d.m.Y H:i:s');
        $rows = [
            XmlHelper::row(1, [XmlHelper::inlineCell('A1', "Дата формирования: {$generatedAt}", 1)]),
            XmlHelper::row(3, [XmlHelper::inlineCell('A3', 'Отчет по остаткам на складе', 2)]),
            XmlHelper::row(4, [XmlHelper::inlineCell('A4', 'Содержит ключевую информацию о номенклатуре для управления запасами', 3)]),
            XmlHelper::row(6, []),
        ];

        $headers = [
            '№ п/п',
            'Категория',
            'Артикул',
            'Наименование материала, изделия или оборудования',
            'Цена, руб.',
            'Ед. изм.',
            'Остаток',
            'Срок поставки',
            'Примечание',
        ];

        $headerCells = [];
        foreach ($headers as $index => $header) {
            $headerCells[] = XmlHelper::inlineCell(XmlHelper::cellRef($index + 1, 7), $header, 4);
        }
        $rows[] = XmlHelper::row(7, $headerCells, 34);

        foreach ($this->products as $index => $product) {
            $rowNumber = $index + 8;
            $rows[] = XmlHelper::row($rowNumber, [
                XmlHelper::numberCell("A{$rowNumber}", $index + 1, 5),
                XmlHelper::inlineCell("B{$rowNumber}", (string) $product['category'], 5),
                XmlHelper::inlineCell("C{$rowNumber}", (string) $product['sku'], 5),
                XmlHelper::inlineCell("D{$rowNumber}", (string) $product['name'], 6),
                XmlHelper::numberCell("E{$rowNumber}", (int) $product['price'], 7),
                XmlHelper::inlineCell("F{$rowNumber}", (string) ($product['unit'] ?? 'Штука'), 5),
                XmlHelper::numberCell("G{$rowNumber}", (int) $product['stock'], 8),
                XmlHelper::numberCell("H{$rowNumber}", XmlHelper::excelDate((string) $product['date']), 9),
                XmlHelper::inlineCell("I{$rowNumber}", (string) ($product['note'] ?? ''), 5),
            ], 24);
        }

        $lastRow = max(8, count($this->products) + 7);
        $rowsXml = implode('', $rows);

        return XmlHelper::header() . <<<XML
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheetViews>
    <sheetView workbookViewId="0" showGridLines="1">
      <pane ySplit="7" topLeftCell="A8" activePane="bottomLeft" state="frozen"/>
      <selection pane="bottomLeft" activeCell="A8" sqref="A8"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="18"/>
  <cols>
    <col min="1" max="1" width="7" customWidth="1"/>
    <col min="2" max="2" width="19" customWidth="1"/>
    <col min="3" max="3" width="15" customWidth="1"/>
    <col min="4" max="4" width="43" customWidth="1"/>
    <col min="5" max="5" width="13" customWidth="1"/>
    <col min="6" max="6" width="10" customWidth="1"/>
    <col min="7" max="7" width="11" customWidth="1"/>
    <col min="8" max="8" width="14" customWidth="1"/>
    <col min="9" max="9" width="19" customWidth="1"/>
  </cols>
  <sheetData>{$rowsXml}</sheetData>
  <mergeCells count="3">
    <mergeCell ref="A1:I1"/>
    <mergeCell ref="A3:I3"/>
    <mergeCell ref="A4:I4"/>
  </mergeCells>
  <conditionalFormatting sqref="G8:G{$lastRow}">
    <cfRule type="cellIs" priority="1" operator="lessThan" dxfId="0">
      <formula>10</formula>
    </cfRule>
    <cfRule type="cellIs" priority="2" operator="greaterThan" dxfId="1">
      <formula>100</formula>
    </cfRule>
  </conditionalFormatting>
  <autoFilter ref="A7:I{$lastRow}"/>
  <pageMargins left="0.5" right="0.5" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>
  <pageSetup orientation="landscape" paperSize="9" fitToWidth="1" fitToHeight="0"/>
</worksheet>
XML;
    }
}
