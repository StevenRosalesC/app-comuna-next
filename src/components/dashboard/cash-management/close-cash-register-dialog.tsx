'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cashRegisterService } from '@/services/cash-register';
import { CashRegister } from '@/interfaces/cash-register';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Lock, AlertTriangle, Loader2, DollarSign, Calendar, User, FileText } from 'lucide-react';

interface CloseCashRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeCashRegister: CashRegister;
  onSuccess?: () => void;
}

export function CloseCashRegisterDialog({
  open,
  onOpenChange,
  activeCashRegister,
  onSuccess
}: CloseCashRegisterDialogProps) {
  const [closingNotes, setClosingNotes] = useState('');
  const queryClient = useQueryClient();

  const closeMutation = useMutation({
    mutationFn: () =>
      cashRegisterService.closeRegister(activeCashRegister.cashRegisterId, {
        closingNotes: closingNotes.trim() || 'Cierre de caja ordinario'
      }),
    onSuccess: () => {
      toast.success('Caja cerrada y arqueo completado correctamente');
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
      queryClient.invalidateQueries({ queryKey: ['cashRegistersHistory'] });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Error al cerrar la caja'
      );
    }
  });

  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    closeMutation.mutate();
  };

  const initialAmount = Number(activeCashRegister.initialAmount || 0);
  const finalAmount = Number(activeCashRegister.finalAmount ?? activeCashRegister.initialAmount ?? 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] p-0 overflow-hidden'>
        {/* Header Banner */}
        <div className='p-6 pb-4 border-b bg-amber-500/5'>
          <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs'>
              <Lock className='h-5 w-5' />
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <DialogTitle className='text-lg font-semibold tracking-tight'>
                  Cierre de Caja y Arqueo
                </DialogTitle>
                <Badge
                  variant='outline'
                  className='text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                >
                  Arqueo
                </Badge>
              </div>
              <DialogDescription className='text-xs text-muted-foreground leading-relaxed'>
                Finaliza la sesión activa de cobros y asienta el saldo total en efectivo.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {/* Form Body */}
        <form onSubmit={handleClose} className='p-6 pt-4 space-y-4'>
          {/* Summary Box */}
          <div className='rounded-xl border bg-muted/40 p-4 space-y-3 text-xs'>
            <div className='flex items-center justify-between border-b pb-2'>
              <span className='flex items-center gap-1.5 text-muted-foreground'>
                <User className='h-3.5 w-3.5' /> Responsable:
              </span>
              <span className='font-semibold text-foreground'>
                {activeCashRegister.openedByUser?.person.firstName}{' '}
                {activeCashRegister.openedByUser?.person.lastName}
              </span>
            </div>

            <div className='flex items-center justify-between border-b pb-2'>
              <span className='flex items-center gap-1.5 text-muted-foreground'>
                <Calendar className='h-3.5 w-3.5' /> Apertura:
              </span>
              <span className='font-medium text-foreground'>
                {new Date(activeCashRegister.openDate).toLocaleString()}
              </span>
            </div>

            <div className='flex items-center justify-between border-b pb-2'>
              <span className='text-muted-foreground'>Monto Inicial:</span>
              <span className='font-medium text-foreground'>
                ${initialAmount.toFixed(2)}
              </span>
            </div>

            <div className='flex items-center justify-between pt-1'>
              <span className='font-semibold text-sm text-foreground'>
                Saldo Final en Caja:
              </span>
              <span className='font-bold text-base text-primary'>
                ${finalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Warning notice */}
          <div className='flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300'>
            <AlertTriangle className='h-4 w-4 shrink-0 mt-0.5' />
            <span>
              Al cerrar la caja se bloquearán nuevos cobros hasta que se aperture una nueva sesión. Esta acción no se puede deshacer.
            </span>
          </div>

          {/* Closing Notes Input */}
          <div className='space-y-1.5'>
            <label className='text-xs font-semibold flex items-center gap-1.5'>
              <FileText className='h-3.5 w-3.5 text-muted-foreground' />
              Notas de Cierre / Observaciones
            </label>
            <Textarea
              placeholder='Ej: Arqueo conforme, saldo cuadrado con vouchers y efectivo en gaveta...'
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
              className='text-xs min-h-[70px]'
              disabled={closeMutation.isPending}
            />
          </div>

          <DialogFooter className='gap-2 sm:gap-0 pt-3 border-t mt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={closeMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              variant='destructive'
              disabled={closeMutation.isPending}
            >
              {closeMutation.isPending ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : (
                <Lock className='mr-2 size-4' />
              )}
              Confirmar Cierre de Caja
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
