'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { FileText, Download, Calendar, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cashRegisterService } from '@/services/cash-register';
import { format, subDays, startOfMonth, startOfYear } from 'date-fns';

export function GenerateReportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const setPreset = (from: Date, to: Date) => {
    setStartDate(format(from, 'yyyy-MM-dd'));
    setEndDate(format(to, 'yyyy-MM-dd'));
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Por favor selecciona las fechas de inicio y fin');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('La fecha de inicio no puede ser mayor a la fecha de fin');
      return;
    }

    setIsLoading(true);
    try {
      const blob = await cashRegisterService.generateReport(startDate, endDate);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-caja-${startDate}-${endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Reporte generado y descargado exitosamente');
      setIsOpen(false);
    } catch (error) {
      toast.error('Error al generar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='h-9 text-xs'>
          <FileText className='h-3.5 w-3.5 mr-2' />
          Generar Reporte PDF
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md p-0 overflow-hidden'>
        {/* Header Banner */}
        <div className='p-6 pb-4 border-b bg-primary/5'>
          <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs'>
              <Sparkles className='h-5 w-5' />
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <DialogTitle className='text-lg font-semibold tracking-tight'>
                  Reporte Financiero de Caja
                </DialogTitle>
                <Badge
                  variant='outline'
                  className='text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 border-primary/30 text-primary bg-primary/10'
                >
                  PDF
                </Badge>
              </div>
              <DialogDescription className='text-xs text-muted-foreground leading-relaxed'>
                Exporta el arqueo consolidado de ingresos, egresos y facturación por rango de fechas.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <div className='p-6 pt-4 space-y-4'>
          {/* Presets */}
          <div className='space-y-1.5'>
            <label className='text-xs font-semibold text-muted-foreground'>
              Rangos Rápidos
            </label>
            <div className='flex flex-wrap gap-1.5'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='h-7 text-xs px-2.5'
                onClick={() => setPreset(new Date(), new Date())}
              >
                Hoy
              </Button>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='h-7 text-xs px-2.5'
                onClick={() => setPreset(subDays(new Date(), 7), new Date())}
              >
                Últimos 7 días
              </Button>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='h-7 text-xs px-2.5'
                onClick={() => setPreset(startOfMonth(new Date()), new Date())}
              >
                Este Mes
              </Button>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='h-7 text-xs px-2.5'
                onClick={() => setPreset(startOfYear(new Date()), new Date())}
              >
                Este Año
              </Button>
            </div>
          </div>

          {/* Date Pickers */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1'>
            <div className='space-y-1.5'>
              <label className='text-xs font-semibold'>Fecha de Inicio</label>
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className='pl-9 text-xs'
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-semibold'>Fecha de Fin</label>
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className='pl-9 text-xs'
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <DialogFooter className='gap-2 sm:gap-0 pt-3 border-t mt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={isLoading || !startDate || !endDate}
            >
              {isLoading ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : (
                <Download className='mr-2 size-4' />
              )}
              Descargar PDF
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}