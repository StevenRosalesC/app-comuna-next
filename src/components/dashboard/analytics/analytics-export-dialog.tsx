'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Settings } from 'lucide-react';
import { ExportButton } from './export-button';

interface AnalyticsExportDialogProps {
  tableType: string;
  title?: string;
  sorting?: { field: string; direction: 'asc' | 'desc' };
  searchTerm?: string;
  viewMode?: 'initial' | 'filtered';
  analyticsFilters?: any;
  currentData?: any[];
  totalCount?: number;
}

export const AnalyticsExportDialog = ({
  tableType,
  title,
  sorting,
  searchTerm,
  viewMode,
  analyticsFilters,
  currentData,
  totalCount
}: AnalyticsExportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportTitle, setExportTitle] = useState(title || 'Reporte de Análisis');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'identification',
    'firstName',
    'lastName',
    'birthDate',
    'email',
    'phone'
  ]);
  const [exportLimit, setExportLimit] = useState(1000);

  const availableColumns = [
    { key: 'identification', label: 'Cédula' },
    { key: 'firstName', label: 'Nombres' },
    { key: 'lastName', label: 'Apellidos' },
    { key: 'birthDate', label: 'Fecha de Nacimiento' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'gender', label: 'Género' },
    { key: 'neighborhood', label: 'Barrio' },
    { key: 'memberStatus', label: 'Estado de Membresía' },
    { key: 'hasDisability', label: 'Tiene Discapacidad' },
    { key: 'disabilityPercentage', label: 'Porcentaje de Discapacidad' }
  ];

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSelectAllColumns = () => {
    setSelectedColumns(availableColumns.map(col => col.key));
  };

  const handleDeselectAllColumns = () => {
    setSelectedColumns([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Exportar con opciones
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Opciones de Exportación</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Export Title */}
          <div className="space-y-2">
            <Label htmlFor="export-title">Título del Reporte</Label>
            <Input
              id="export-title"
              value={exportTitle}
              onChange={(e) => setExportTitle(e.target.value)}
              placeholder="Ingrese el título del reporte"
            />
          </div>

          {/* Export Limit */}
          <div className="space-y-2">
            <Label htmlFor="export-limit">Límite de Registros</Label>
            <Select value={exportLimit.toString()} onValueChange={(value) => setExportLimit(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100 registros</SelectItem>
                <SelectItem value="500">500 registros</SelectItem>
                <SelectItem value="1000">1,000 registros</SelectItem>
                <SelectItem value="5000">5,000 registros</SelectItem>
                <SelectItem value="10000">10,000 registros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Column Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Columnas a incluir</Label>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAllColumns}
                  className="text-xs"
                >
                  Todas
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeselectAllColumns}
                  className="text-xs"
                >
                  Ninguna
                </Button>
              </div>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
              {availableColumns.map((column) => (
                <div key={column.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.key}
                    checked={selectedColumns.includes(column.key)}
                    onCheckedChange={() => handleColumnToggle(column.key)}
                  />
                  <Label htmlFor={column.key} className="text-sm">
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Info */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Tipo de tabla: {tableType}</p>
            <p>• Vista actual: {viewMode === 'filtered' ? 'Datos Filtrados' : 'Todos los Datos'}</p>
            <p>• Registros disponibles: {totalCount?.toLocaleString() || 'N/A'}</p>
            <p>• Columnas seleccionadas: {selectedColumns.length}</p>
          </div>

          {/* Export Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <ExportButton
              tableType={tableType}
              title={exportTitle}
              sorting={sorting}
              columns={selectedColumns}
              limit={exportLimit}
              searchTerm={searchTerm}
              viewMode={viewMode}
              analyticsFilters={analyticsFilters}
              variant="default"
              className="flex-1"
              onExportSuccess={() => setIsOpen(false)}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </ExportButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 