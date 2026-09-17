<?php

declare(strict_types=1);

namespace NanoGadgets\Xlsx;

use NanoGadgets\Report\InventoryWorksheet;

final class XlsxPackage
{
    public function __construct(
        private readonly InventoryWorksheet $worksheet,
        private readonly WorkbookMetadataXml $metadata,
    ) {
    }

    /**
     * @return array<string, string>
     */
    public function files(): array
    {
        return [
            '[Content_Types].xml' => $this->metadata->contentTypesXml(),
            '_rels/.rels' => $this->metadata->rootRelationshipsXml(),
            'xl/workbook.xml' => $this->metadata->workbookXml(),
            'xl/_rels/workbook.xml.rels' => $this->metadata->workbookRelationshipsXml(),
            'xl/styles.xml' => (new StylesXml())->xml(),
            'xl/worksheets/sheet1.xml' => $this->worksheet->xml(),
            'docProps/core.xml' => $this->metadata->corePropertiesXml(),
            'docProps/app.xml' => $this->metadata->appPropertiesXml(),
        ];
    }
}
