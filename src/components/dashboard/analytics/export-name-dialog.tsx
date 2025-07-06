'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';

interface ExportNameDialogProps {
  children: React.ReactNode;
  onExport: (reportName: string, type: 'pdf' | 'excel') => void;
  defaultTitle?: string;
  type: 'pdf' | 'excel';
}

export const ExportNameDialog = ({ children, onExport, defaultTitle = 'Reporte de Análisis', type }: ExportNameDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportName, setReportName] = useState(defaultTitle);

  const handleExport = () => {
    if (reportName.trim()) {
      onExport(reportName.trim(), type);
      setIsOpen(false);
      setReportName(defaultTitle); // Reset to default
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExport();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nombre del Reporte</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-name">Título del reporte</Label>
            <Input
              id="report-name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ingrese el nombre del reporte"
              autoFocus
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExport}
              disabled={!reportName.trim()}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar {type === 'excel' ? 'Excel' : 'PDF'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 