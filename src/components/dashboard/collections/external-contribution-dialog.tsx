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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { UserPlus, DollarSign, Loader2, Heart } from 'lucide-react';
import { collectionsService } from '@/services/collections';

interface ExternalContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  onSuccess?: () => void;
}

export function ExternalContributionDialog({
  open,
  onOpenChange,
  collectionId,
  onSuccess
}: ExternalContributionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState<number>(10.0);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setDonorName('');
    setAmount(10.0);
    setNotes('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onOpenChange(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) {
      toast.error('El nombre del donante es obligatorio');
      return;
    }

    if (amount <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    setIsSubmitting(true);
    try {
      await collectionsService.createExternalContribution(collectionId, {
        externalDonorName: donorName.trim(),
        amount: Number(amount),
        notes: notes.trim() || undefined
      });
      toast.success('Aporte voluntario registrado exitosamente');
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Error al registrar el donante externo'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden'>
        <div className='p-5 pb-4 border-b bg-purple-500/10 text-purple-950 dark:text-purple-50'>
          <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/20 text-purple-600 dark:text-purple-400'>
              <UserPlus className='h-5 w-5' />
            </div>
            <div className='flex flex-1 flex-col gap-0.5'>
              <DialogTitle className='text-base font-semibold'>
                Nuevo Donante Externo
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground'>
                Registra la colaboración voluntaria de una persona no socia.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='p-5 space-y-4 text-sm'>
            <div className='space-y-1.5'>
              <Label htmlFor='extDonorName' className='font-semibold text-xs'>
                Nombre Completo del Donante <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='extDonorName'
                placeholder='Ej: Ing. Marcelo Torres'
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='extAmount' className='font-semibold text-xs'>
                  Monto de Donación ($) <span className='text-destructive'>*</span>
                </Label>
              </div>
              <div className='relative'>
                <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600 dark:text-purple-400' />
                <Input
                  id='extAmount'
                  type='number'
                  step='1.00'
                  min='1.00'
                  placeholder='10.00'
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className='pl-9 text-lg font-bold text-purple-600 dark:text-purple-400'
                  disabled={isSubmitting}
                />
              </div>

              {/* Quick preset chips */}
              <div className='flex items-center gap-1.5 pt-1'>
                <span className='text-[11px] text-muted-foreground mr-1'>Sugerido:</span>
                {[5, 10, 20, 50].map((val) => (
                  <Button
                    key={val}
                    type='button'
                    variant={amount === val ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setAmount(val)}
                    className='h-7 text-xs px-2.5'
                  >
                    ${val.toFixed(2)}
                  </Button>
                ))}
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='extNotes' className='text-xs font-medium'>
                Observaciones / Detalle (Opcional)
              </Label>
              <Textarea
                id='extNotes'
                placeholder='Ej: Amigo de la familia, vecino del barrio central...'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className='p-4 border-t bg-muted/20 gap-2 sm:gap-0'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              className='bg-purple-600 hover:bg-purple-700 text-white'
              disabled={isSubmitting || !donorName.trim() || amount <= 0}
            >
              {isSubmitting ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : (
                <Heart className='mr-2 size-4' />
              )}
              Registrar Aporte (${amount.toFixed(2)})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
