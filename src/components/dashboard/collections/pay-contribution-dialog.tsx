'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  DollarSign,
  Loader2,
  CheckCircle2,
  User,
  Home,
  MapPin,
  Search,
  Users
} from 'lucide-react';
import { collectionsService } from '@/services/collections';
import { Contribution } from '@/interfaces/collections';

interface PayContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contribution: Contribution | null;
  allContributions?: Contribution[];
  baseAmount?: number;
  collectionId?: string;
  onSuccess?: () => void;
}

export function PayContributionDialog({
  open,
  onOpenChange,
  contribution: initialContribution,
  allContributions = [],
  baseAmount = 5.0,
  collectionId: propCollectionId,
  onSuccess
}: PayContributionDialogProps) {
  const params = useParams<{ id: string }>();
  const activeCollectionId =
    (params?.id as string) || propCollectionId || initialContribution?.collectionId || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedContributionId, setSelectedContributionId] = useState<string>('');
  const [amount, setAmount] = useState<number>(5.0);
  const [notes, setNotes] = useState('Cobro en mesa');
  const [comuneroSearch, setComuneroSearch] = useState('');

  // Active contribution being paid
  const activeContribution = useMemo(() => {
    if (initialContribution) return initialContribution;
    if (selectedContributionId) {
      return allContributions.find((c) => c.contributionId === selectedContributionId) || null;
    }
    return null;
  }, [initialContribution, selectedContributionId, allContributions]);

  // Filter pending comuneros for the select dropdown
  const pendingComuneros = useMemo(() => {
    return allContributions.filter(
      (c) => !c.isExternal && c.contributionStatus === 'PENDING'
    );
  }, [allContributions]);

  // Determine suggested amount based on discount
  const isSenior = activeContribution?.discountType === 'SENIOR';
  const isDisability = activeContribution?.discountType === 'DISABILITY';
  const hasDiscount =
    isSenior || isDisability || (activeContribution?.discountPercentage || 0) > 0;
  const suggestedAmount =
    activeContribution?.suggestedAmount ??
    (hasDiscount ? baseAmount * 0.5 : baseAmount);

  useEffect(() => {
    if (initialContribution) {
      setSelectedContributionId(initialContribution.contributionId);
      setAmount(suggestedAmount);
      setNotes('Cobro en mesa');
    } else if (open && pendingComuneros.length > 0 && !selectedContributionId) {
      setSelectedContributionId(pendingComuneros[0].contributionId);
    }
  }, [initialContribution, suggestedAmount, open, pendingComuneros, selectedContributionId]);

  useEffect(() => {
    if (activeContribution) {
      setAmount(suggestedAmount);
    }
  }, [activeContribution, suggestedAmount]);

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedContributionId('');
      setComuneroSearch('');
      onOpenChange(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContribution) {
      toast.error('Selecciona un comunero para cobrar');
      return;
    }

    if (amount <= 0) {
      toast.error('El monto a cobrar debe ser mayor a 0');
      return;
    }

    setIsSubmitting(true);
    try {
      const activeMemberId = activeContribution.memberId || activeContribution.member?.memberId;
      const targetCollectionId = activeCollectionId || activeContribution.collectionId;

      // Option B (Recommended: Upsert by collectionId + memberId)
      if (targetCollectionId && activeMemberId && !activeContribution.isExternal) {
        await collectionsService.payContributionByMember(
          targetCollectionId,
          activeMemberId,
          {
            amount: Number(amount),
            notes: notes.trim() || undefined
          }
        );
      } else if (activeContribution.contributionId && !activeContribution.contributionId.startsWith('temp-')) {
        // Option A (By contribution UUID)
        await collectionsService.payContribution(activeContribution.contributionId, {
          amount: Number(amount),
          notes: notes.trim() || undefined
        });
      } else {
        throw new Error('No se pudo determinar el socio o la colecta para registrar el cobro');
      }

      toast.success('¡Cobro registrado exitosamente en mesa!');
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Error al registrar el cobro del comunero'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const person = activeContribution?.member?.person;
  const fullName = person
    ? `${person.firstName || ''} ${person.lastName || ''}`.trim() || `${person.lastName || ''} ${person.firstName || ''}`.trim()
    : activeContribution?.externalDonorName || 'Comunero';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[500px] p-0 overflow-hidden max-h-[92vh] flex flex-col'>
        {/* Header */}
        <div className='p-5 pb-4 border-b bg-emerald-500/10 text-emerald-950 dark:text-emerald-50 shrink-0'>
          <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'>
              <DollarSign className='h-5 w-5' />
            </div>
            <div className='flex flex-1 flex-col gap-0.5'>
              <DialogTitle className='text-base font-semibold'>
                Registrar Cobro de Comunero
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground'>
                Mesa de recaudación en vivo de la colecta
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col flex-1 overflow-hidden'>
          <div className='p-5 space-y-4 text-sm overflow-y-auto flex-1'>
            {/* If opened without a preselected row, show member selector */}
            {!initialContribution && (
              <div className='space-y-1.5'>
                <Label className='font-semibold text-xs'>
                  Seleccionar Comunero Pendiente <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={selectedContributionId}
                  onValueChange={setSelectedContributionId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Buscar comunero pendiente...' />
                  </SelectTrigger>
                  <SelectContent className='max-h-60'>
                    {pendingComuneros.length === 0 ? (
                      <div className='p-3 text-center text-xs text-muted-foreground'>
                        No hay comuneros pendientes de cobro
                      </div>
                    ) : (
                      pendingComuneros.map((c) => {
                        const p = c.member?.person;
                        return (
                          <SelectItem key={c.contributionId} value={c.contributionId}>
                            {p?.lastName} {p?.firstName} (CI: {p?.identification} - Casa: {c.member?.houseNumber || 'S/N'})
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Comunero Card Info */}
            {activeContribution && (
              <div className='rounded-xl border bg-muted/20 p-3.5 space-y-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 font-semibold text-foreground'>
                    <User className='h-4 w-4 text-primary' />
                    <span>{fullName}</span>
                  </div>
                  {isSenior && (
                    <Badge
                      variant='secondary'
                      className='bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[11px]'
                    >
                      3ra Edad - 50%
                    </Badge>
                  )}
                  {isDisability && (
                    <Badge
                      variant='secondary'
                      className='bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-[11px]'
                    >
                      Discapacidad - 50%
                    </Badge>
                  )}
                  {!hasDiscount && (
                    <Badge variant='outline' className='text-[11px]'>
                      Tarifa Regular
                    </Badge>
                  )}
                </div>

                <div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t'>
                  <div>
                    <span>CI: </span>
                    <span className='font-medium text-foreground'>
                      {person?.identification || 'N/A'}
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Home className='h-3 w-3' />
                    <span>Casa: </span>
                    <span className='font-medium text-foreground'>
                      {activeContribution.member?.houseNumber || 'S/N'}
                    </span>
                  </div>
                  {person?.neighborhood && (
                    <div className='col-span-2 flex items-center gap-1'>
                      <MapPin className='h-3 w-3' />
                      <span>Barrio: </span>
                      <span className='font-medium text-foreground'>
                        {person.neighborhood.neighborhoodName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='amount' className='font-semibold text-xs'>
                  Monto Recibido ($) <span className='text-destructive'>*</span>
                </Label>
                <span className='text-xs text-muted-foreground'>
                  Cuota sugerida: ${suggestedAmount.toFixed(2)}
                </span>
              </div>
              <div className='relative'>
                <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                <Input
                  id='amount'
                  type='number'
                  step='0.25'
                  min='0.25'
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className='pl-9 text-lg font-bold text-emerald-600 dark:text-emerald-400'
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className='flex items-center gap-1.5 pt-1'>
                <span className='text-[11px] text-muted-foreground mr-1'>Rápido:</span>
                {[suggestedAmount, baseAmount, 5, 10, 20].filter((v, idx, arr) => arr.indexOf(v) === idx).map((val, idx) => (
                  <Button
                    key={idx}
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

            {/* Notes */}
            <div className='space-y-1.5'>
              <Label htmlFor='payNotes' className='text-xs font-medium'>
                Nota / Observación
              </Label>
              <Input
                id='payNotes'
                placeholder='Ej: Cobro en mesa, aportó voluntariamente extra'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting}
              />
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
              className='bg-emerald-600 hover:bg-emerald-700 text-white font-semibold'
              disabled={isSubmitting || !activeContribution || amount <= 0}
            >
              {isSubmitting ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : (
                <CheckCircle2 className='mr-2 size-4' />
              )}
              Confirmar Cobro (${amount.toFixed(2)})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
