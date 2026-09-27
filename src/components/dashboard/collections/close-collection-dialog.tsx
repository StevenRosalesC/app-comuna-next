'use client';

import { useState, useEffect } from 'react';
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
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Lock,
  Loader2,
  AlertTriangle,
  Receipt,
  Heart,
  PiggyBank,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { collectionsService } from '@/services/collections';
import { fundsService } from '@/services/funds';
import { Collection } from '@/interfaces/collections';
import { Fund } from '@/interfaces/funds';

interface CloseCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: Collection | null;
  onSuccess?: () => void;
}

export function CloseCollectionDialog({
  open,
  onOpenChange,
  collection,
  onSuccess
}: CloseCollectionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retentionPercentage, setRetentionPercentage] = useState<number>(10);
  const [destinationFundId, setDestinationFundId] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);
  const [notes, setNotes] = useState('');
  const [funds, setFunds] = useState<Fund[]>([]);

  useEffect(() => {
    if (collection) {
      setRetentionPercentage(collection.fundRetentionPercentage ?? 10);
      setDestinationFundId(collection.destinationFundId || '');
      setNotes('Liquidación final de colecta solidaria');
      setConfirmed(false);
    }
  }, [collection]);

  useEffect(() => {
    if (open) {
      fundsService
        .getFunds()
        .then((data) => {
          setFunds(data);
          if (!destinationFundId && data.length > 0) {
            const commonFund = data.find((f) =>
              f.name.toLowerCase().includes('común') || f.name.toLowerCase().includes('comun')
            );
            setDestinationFundId(commonFund ? commonFund.fundId : data[0].fundId);
          }
        })
        .catch(() => {});
    }
  }, [open, destinationFundId]);

  const totalCollected = Number(collection?.summary?.totalCollected ?? 0);
  const retainedForFund = (totalCollected * retentionPercentage) / 100;
  const netForFamily = totalCollected - retainedForFund;

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collection) return;

    if (!confirmed) {
      toast.error('Debes marcar la casilla de confirmación para liquidar');
      return;
    }

    setIsSubmitting(true);
    try {
      await collectionsService.closeCollection(collection.collectionId, {
        fundRetentionPercentage: Number(retentionPercentage),
        destinationFundId: destinationFundId || null,
        notes: notes.trim() || undefined
      });

      toast.success('¡Colecta liquidada y cerrada exitosamente!');
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Error al liquidar la colecta'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[560px] p-0 overflow-hidden max-h-[90vh] flex flex-col'>
        <div className='p-5 pb-4 border-b bg-amber-500/10 text-amber-950 dark:text-amber-50 shrink-0'>
          <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-600 dark:text-amber-400'>
              <AlertTriangle className='h-5 w-5' />
            </div>
            <div className='flex flex-1 flex-col gap-0.5'>
              <DialogTitle className='text-base font-semibold'>
                Cierre y Liquidación de Colecta
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground'>
                Finaliza la recaudación y transfiere el porcentaje pactado al fondo comunitario.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col flex-1 overflow-hidden'>
          <div className='p-5 space-y-4 overflow-y-auto flex-1 text-sm'>
            {/* Financial Summary Box */}
            <div className='rounded-xl border bg-card p-4 space-y-3'>
              <div className='flex items-center justify-between border-b pb-2.5'>
                <span className='font-semibold text-xs text-muted-foreground uppercase tracking-wider'>
                  Total Recaudado en Efectivo
                </span>
                <span className='text-xl font-black text-foreground'>
                  ${totalCollected.toFixed(2)}
                </span>
              </div>

              {/* Retention Percentage Slider */}
              <div className='space-y-2 pt-1'>
                <div className='flex items-center justify-between'>
                  <Label className='font-semibold text-xs'>
                    Porcentaje para Fondo Común
                  </Label>
                  <span className='font-bold text-xs text-primary'>
                    {retentionPercentage}%
                  </span>
                </div>
                <Slider
                  value={[retentionPercentage]}
                  onValueChange={(vals) => setRetentionPercentage(vals[0])}
                  min={0}
                  max={100}
                  step={1}
                  disabled={isSubmitting}
                />
              </div>

              {/* Calculations Cards */}
              <div className='grid grid-cols-2 gap-3 pt-2'>
                <div className='rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-1'>
                  <div className='flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-medium'>
                    <Heart className='h-3.5 w-3.5' />
                    <span>Para la Familia (Neto)</span>
                  </div>
                  <div className='text-lg font-bold text-emerald-600 dark:text-emerald-400'>
                    ${netForFamily.toFixed(2)}
                  </div>
                  <div className='text-[10px] text-muted-foreground'>
                    {100 - retentionPercentage}% de lo recaudado
                  </div>
                </div>

                <div className='rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 space-y-1'>
                  <div className='flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 font-medium'>
                    <PiggyBank className='h-3.5 w-3.5' />
                    <span>Para Fondo Comunal</span>
                  </div>
                  <div className='text-lg font-bold text-blue-600 dark:text-blue-400'>
                    ${retainedForFund.toFixed(2)}
                  </div>
                  <div className='text-[10px] text-muted-foreground'>
                    {retentionPercentage}% retención
                  </div>
                </div>
              </div>
            </div>

            {/* Destination Fund */}
            <div className='space-y-1.5'>
              <Label htmlFor='closeDestinationFund' className='font-semibold text-xs'>
                Fondo Comunitario Destino
              </Label>
              <Select
                value={destinationFundId}
                onValueChange={setDestinationFundId}
                disabled={isSubmitting}
              >
                <SelectTrigger id='closeDestinationFund'>
                  <SelectValue placeholder='Seleccionar fondo...' />
                </SelectTrigger>
                <SelectContent>
                  {funds.map((f) => (
                    <SelectItem key={f.fundId} value={f.fundId}>
                      {f.name} (Saldo: ${Number(f.currentBalance || 0).toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className='space-y-1.5'>
              <Label htmlFor='closeNotes' className='text-xs font-medium'>
                Acta / Observaciones de Liquidación
              </Label>
              <Textarea
                id='closeNotes'
                placeholder='Ej: Liquidación aprobada por la directiva y entregado el saldo a la familia...'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                disabled={isSubmitting}
              />
            </div>

            {/* Confirmation Checkbox */}
            <div className='flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3'>
              <Checkbox
                id='confirmClose'
                checked={confirmed}
                onCheckedChange={(c) => setConfirmed(Boolean(c))}
                className='mt-0.5'
                disabled={isSubmitting}
              />
              <label
                htmlFor='confirmClose'
                className='text-xs leading-relaxed text-foreground cursor-pointer select-none font-medium'
              >
                Confirmo que la colecta ha finalizado y se registrará el ingreso de{' '}
                <span className='text-primary font-bold'>
                  ${retainedForFund.toFixed(2)}
                </span>{' '}
                en el Fondo Común.
              </label>
            </div>
          </div>

          <DialogFooter className='p-4 border-t bg-muted/20 gap-2 sm:gap-0 shrink-0'>
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
              className='bg-amber-600 hover:bg-amber-700 text-white'
              disabled={isSubmitting || !confirmed}
            >
              {isSubmitting ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : (
                <Lock className='mr-2 size-4' />
              )}
              Confirmar Cierre y Liquidar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
