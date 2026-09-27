'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { fundsService } from '@/services/funds';
import { Fund, MovementType } from '@/interfaces/funds';

interface CreateFundMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fund: Fund | null;
  fundId?: string;
  onSuccess?: () => void;
  collectionId?: string;
}

export function CreateFundMovementDialog({
  open,
  onOpenChange,
  fund,
  fundId: propFundId,
  onSuccess,
  collectionId
}: CreateFundMovementDialogProps) {
  const params = useParams<{ id: string }>();
  const targetFundId = (params?.id as string) || propFundId || fund?.fundId || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<MovementType>('INCOME');
  const [amount, setAmount] = useState<number>(50.0);
  const [concept, setConcept] = useState('');

  const currentBalance = Number(fund?.currentBalance || 0);
  const isExpense = type === 'EXPENSE';
  const isExceedingBalance = isExpense && amount > currentBalance;

  const resetForm = () => {
    setType('INCOME');
    setAmount(50.0);
    setConcept('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onOpenChange(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetFundId) {
      toast.error('No se encontró el ID del fondo');
      return;
    }

    if (!concept.trim()) {
      toast.error('El concepto o motivo del movimiento es obligatorio');
      return;
    }

    if (amount <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    if (isExceedingBalance) {
      toast.error(
        `El monto del egreso ($${amount.toFixed(2)}) supera el saldo disponible ($${currentBalance.toFixed(2)})`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await fundsService.createFundMovement(targetFundId, {
        type,
        amount: Number(amount),
        concept: concept.trim(),
        sourceType: isExpense ? 'MANUAL_WITHDRAWAL' : 'MANUAL_DEPOSIT'
      });
      toast.success(
        `¡${isExpense ? 'Egreso' : 'Ingreso'} de $${amount.toFixed(2)} registrado correctamente!`
      );
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Error al registrar el movimiento'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden'>
        {/* Header */}
        <div
          className={`p-5 pb-4 border-b ${
            isExpense
              ? 'bg-rose-500/10 text-rose-950 dark:text-rose-50'
              : 'bg-emerald-500/10 text-emerald-950 dark:text-emerald-50'
          }`}
        >
          <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                isExpense
                  ? 'border-rose-500/30 bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  : 'border-emerald-500/30 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isExpense ? (
                <ArrowUpRight className='h-5 w-5' />
              ) : (
                <ArrowDownLeft className='h-5 w-5' />
              )}
            </div>
            <div className='flex flex-1 flex-col gap-0.5'>
              <DialogTitle className='text-base font-semibold'>
                Registrar Movimiento Manual
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground'>
                Fondo:{' '}
                <span className='font-semibold text-foreground'>
                  {fund?.name}
                </span>{' '}
                • Saldo actual: ${currentBalance.toFixed(2)}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='p-5 space-y-4 text-sm'>
            {/* Type Selector Tabs */}
            <div className='space-y-1.5'>
              <Label className='font-semibold text-xs'>Tipo de Movimiento</Label>
              <Tabs
                value={type}
                onValueChange={(val) => setType(val as MovementType)}
                className='w-full'
              >
                <TabsList className='grid grid-cols-2 w-full'>
                  <TabsTrigger
                    value='INCOME'
                    className='text-xs flex items-center gap-1.5 data-[state=active]:bg-emerald-500 data-[state=active]:text-white'
                  >
                    <ArrowDownLeft className='h-3.5 w-3.5' />
                    Ingreso ($)
                  </TabsTrigger>
                  <TabsTrigger
                    value='EXPENSE'
                    className='text-xs flex items-center gap-1.5 data-[state=active]:bg-rose-500 data-[state=active]:text-white'
                  >
                    <ArrowUpRight className='h-3.5 w-3.5' />
                    Egreso ($)
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Amount */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='movAmount' className='font-semibold text-xs'>
                  Monto ($) <span className='text-destructive'>*</span>
                </Label>
                {isExpense && (
                  <span
                    className={`text-xs ${
                      isExceedingBalance
                        ? 'text-destructive font-bold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    Disponible: ${currentBalance.toFixed(2)}
                  </span>
                )}
              </div>
              <div className='relative'>
                <DollarSign
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                    isExpense
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                />
                <Input
                  id='movAmount'
                  type='number'
                  step='1.00'
                  min='1.00'
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className={`pl-9 text-lg font-bold ${
                    isExpense
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              {isExceedingBalance && (
                <div className='flex items-center gap-1.5 text-xs text-destructive font-medium'>
                  <AlertCircle className='h-4 w-4 shrink-0' />
                  <span>
                    No es posible registrar un egreso superior al saldo disponible del fondo.
                  </span>
                </div>
              )}
            </div>

            {/* Concept */}
            <div className='space-y-1.5'>
              <Label htmlFor='movConcept' className='font-semibold text-xs'>
                Concepto / Motivo <span className='text-destructive'>*</span>
              </Label>
              <Textarea
                id='movConcept'
                placeholder={
                  isExpense
                    ? 'Ej: Compra de repuestos para tubería comunal, pago de transporte...'
                    : 'Ej: Aporte extraordinario de asamblea, donación directa...'
                }
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
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
              className={
                isExpense
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }
              disabled={isSubmitting || !concept.trim() || amount <= 0 || isExceedingBalance}
            >
              {isSubmitting ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : (
                <CheckCircle2 className='mr-2 size-4' />
              )}
              Registrar {isExpense ? 'Egreso' : 'Ingreso'} (${amount.toFixed(2)})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
