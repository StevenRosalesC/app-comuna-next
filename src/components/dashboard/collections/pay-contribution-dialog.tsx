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
  Percent,
  Calculator,
  Coins,
  Receipt,
  HeartHandshake,
  Lock
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
  isClosed?: boolean;
  onSuccess?: () => void;
}

const COMMON_NOTES = [
  'Cobro en mesa',
  'Aporte voluntario extra',
  'Pagado por familiar',
  'Pago exacto'
];

export function PayContributionDialog({
  open,
  onOpenChange,
  contribution: initialContribution,
  allContributions = [],
  baseAmount = 5.0,
  collectionId: propCollectionId,
  isClosed = false,
  onSuccess
}: PayContributionDialogProps) {
  const params = useParams<{ id: string }>();
  const activeCollectionId =
    (params?.id as string) || propCollectionId || initialContribution?.collectionId || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedContributionId, setSelectedContributionId] = useState<string>('');
  const [amount, setAmount] = useState<number>(5.0);
  const [cashGiven, setCashGiven] = useState<number | ''>('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [notes, setNotes] = useState('Cobro en mesa');

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

  // Determine discounts & suggested amount
  const isSenior = activeContribution?.discountType === 'SENIOR';
  const isDisability = activeContribution?.discountType === 'DISABILITY';
  const hasDiscount =
    isSenior || isDisability || (activeContribution?.discountPercentage || 0) > 0;
  const discountPercent = hasDiscount
    ? activeContribution?.discountPercentage || 50
    : 0;
  const suggestedAmount =
    activeContribution?.suggestedAmount ??
    (hasDiscount ? baseAmount * (1 - discountPercent / 100) : baseAmount);

  // Sync state upon opening
  useEffect(() => {
    if (open) {
      if (initialContribution) {
        setSelectedContributionId(initialContribution.contributionId);
      } else if (pendingComuneros.length > 0 && !selectedContributionId) {
        setSelectedContributionId(pendingComuneros[0].contributionId);
      }
      setAmount(suggestedAmount);
      setCashGiven('');
      setNotes('Cobro en mesa');
    }
  }, [open, initialContribution, suggestedAmount, pendingComuneros, selectedContributionId]);

  useEffect(() => {
    if (activeContribution) {
      setAmount(suggestedAmount);
    }
  }, [activeContribution, suggestedAmount]);

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedContributionId('');
      setCashGiven('');
      setShowCalculator(false);
      onOpenChange(false);
    }
  };

  // Change calculation
  const changeDue = useMemo(() => {
    if (typeof cashGiven !== 'number' || isNaN(cashGiven)) return 0;
    return Math.max(0, cashGiven - (amount || 0));
  }, [cashGiven, amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isClosed) {
      toast.error('Esta colecta ya se encuentra cerrada y liquidada. No se admiten nuevos pagos.');
      return;
    }

    if (!activeContribution) {
      toast.error('Selecciona un comunero para registrar el cobro');
      return;
    }

    if (amount <= 0) {
      toast.error('El monto a cobrar debe ser mayor a $0.00');
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

      toast.success('¡Cobro registrado exitosamente en mesa! 💵');
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
    ? `${person.firstName || ''} ${person.lastName || ''}`.trim() ||
      `${person.lastName || ''} ${person.firstName || ''}`.trim()
    : activeContribution?.externalDonorName || 'Comunero';

  const avatarInitials = person
    ? `${person.firstName?.[0] || ''}${person.lastName?.[0] || ''}`.toUpperCase() || 'C'
    : 'C';

  // Quick preset amounts
  const presetAmounts = useMemo(() => {
    const list = [suggestedAmount, baseAmount, 1, 2, 5, 10, 20].filter(
      (v, idx, arr) => arr.indexOf(v) === idx && v > 0
    );
    return list.sort((a, b) => a - b);
  }, [suggestedAmount, baseAmount]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[560px] p-0 overflow-hidden rounded-2xl border shadow-2xl flex flex-col max-h-[94vh]'>
        {/* Header with Emerald Gradient */}
        <div className={`relative px-7 py-5.5 border-b shrink-0 ${
          isClosed
            ? 'bg-slate-500/10 dark:bg-slate-900/30'
            : 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:via-emerald-900/20 dark:to-teal-950/30'
        }`}>
          <DialogHeader className='flex flex-row items-center gap-4 space-y-0'>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${
              isClosed ? 'bg-slate-600 shadow-slate-600/30' : 'bg-emerald-600 shadow-emerald-600/30'
            }`}>
              {isClosed ? <Lock className='h-6 w-6' /> : <Receipt className='h-6 w-6' />}
            </div>
            <div className='flex flex-1 flex-col gap-0.5'>
              <DialogTitle className='text-lg font-bold tracking-tight text-foreground flex items-center gap-2'>
                {isClosed ? 'Detalle de Cobro (Colecta Cerrada)' : 'Registrar Cobro en Mesa'}
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground flex items-center gap-1.5'>
                {isClosed ? (
                  <span className='font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1'>
                    <Lock className='h-3 w-3' /> Esta colecta ya está cerrada y liquidada
                  </span>
                ) : (
                  <>
                    <span>Mesa de recaudación en vivo</span>
                    <span>•</span>
                    <span className='font-semibold text-emerald-600 dark:text-emerald-400'>
                      Cuota base: ${Number(baseAmount).toFixed(2)}
                    </span>
                  </>
                )}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {isClosed && (
          <div className='bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 text-xs text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2'>
            <Lock className='h-4 w-4 shrink-0 text-amber-600' />
            <span>Colecta cerrada: No se pueden registrar nuevos cobros para esta colecta.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col flex-1 overflow-hidden'>
          <div className='px-7 py-6 space-y-5 overflow-y-auto flex-1 text-sm'>
            {/* If opened without preselected comunero */}
            {!initialContribution && (
              <div className='space-y-2'>
                <Label className='font-semibold text-xs text-foreground'>
                  Seleccionar Comunero Pendiente <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={selectedContributionId}
                  onValueChange={setSelectedContributionId}
                  disabled={isSubmitting || isClosed}
                >
                  <SelectTrigger className='w-full h-11 px-3.5 rounded-xl font-medium'>
                    <SelectValue placeholder='Buscar comunero pendiente...' />
                  </SelectTrigger>
                  <SelectContent className='max-h-60 rounded-xl p-1'>
                    {pendingComuneros.length === 0 ? (
                      <div className='p-4 text-center text-xs text-muted-foreground'>
                        No hay comuneros pendientes de cobro en esta colecta
                      </div>
                    ) : (
                      pendingComuneros.map((c) => {
                        const p = c.member?.person;
                        return (
                          <SelectItem key={c.contributionId} value={c.contributionId} className='py-2 px-3'>
                            {p?.lastName} {p?.firstName} (CI: {p?.identification} • Casa: {c.member?.houseNumber || 'S/N'})
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Comunero Profile Card */}
            {activeContribution && (
              <div className='rounded-2xl border bg-gradient-to-br from-muted/50 via-muted/30 to-background p-5 space-y-3.5 shadow-xs'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex items-center gap-3.5 min-w-0'>
                    <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-black text-sm border border-primary/20'>
                      {avatarInitials}
                    </div>
                    <div className='min-w-0 space-y-0.5'>
                      <h4 className='font-bold text-sm text-foreground truncate'>
                        {fullName}
                      </h4>
                      <p className='text-xs text-muted-foreground font-mono'>
                        CI: {person?.identification || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Tariff Discount Badge */}
                  <div className='shrink-0'>
                    {isSenior && (
                      <Badge className='bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[11px] font-bold gap-1 px-2.5 py-1'>
                        <Percent className='h-3 w-3' /> 3ra Edad (-50%)
                      </Badge>
                    )}
                    {isDisability && (
                      <Badge className='bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[11px] font-bold gap-1 px-2.5 py-1'>
                        <Percent className='h-3 w-3' /> Discapacidad (-50%)
                      </Badge>
                    )}
                    {!hasDiscount && (
                      <Badge variant='outline' className='text-[11px] font-semibold text-muted-foreground px-2.5 py-1'>
                        Tarifa Regular
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Location & Details row */}
                <div className='grid grid-cols-2 gap-3 text-xs pt-3 border-t border-border/60 text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <Home className='h-3.5 w-3.5 text-primary/70 shrink-0' />
                    <span className='truncate'>
                      Casa #{activeContribution.member?.houseNumber || 'S/N'}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-3.5 w-3.5 text-primary/70 shrink-0' />
                    <span className='truncate font-medium text-foreground'>
                      {person?.neighborhood?.neighborhoodName || 'Comunidad'}
                    </span>
                  </div>
                </div>

                {/* Calculation Summary Bar */}
                {hasDiscount && (
                  <div className='flex items-center justify-between text-xs px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/20 font-medium'>
                    <span>Cuota Base: ${Number(baseAmount).toFixed(2)} - 50% desc.</span>
                    <span className='font-bold'>Monto Sugerido: ${suggestedAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Main Cash Payment Box */}
            <div className='rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3.5'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='amountInput' className='font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5'>
                  <Coins className='h-4 w-4 text-emerald-600' /> Monto Recibido para el Aporte
                </Label>
                <Badge variant='outline' className='text-[11px] bg-background/80 font-bold text-emerald-700 dark:text-emerald-300 border-emerald-500/30 px-2.5 py-0.5'>
                  Sugerido: ${suggestedAmount.toFixed(2)}
                </Badge>
              </div>

              {/* Large POS Currency Input */}
              <div className='relative'>
                <DollarSign className='absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                <Input
                  id='amountInput'
                  type='number'
                  step='0.25'
                  min='0.25'
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className='pl-12 h-14 text-2xl font-black text-emerald-600 dark:text-emerald-400 bg-background border-emerald-500/40 rounded-xl shadow-inner focus-visible:ring-emerald-500'
                  disabled={isSubmitting || isClosed}
                  autoFocus={!isClosed}
                />
              </div>

              {/* Fast Preset Chips */}
              {!isClosed && (
                <div className='space-y-2 pt-1'>
                  <div className='flex items-center justify-between text-[11px] text-muted-foreground font-semibold'>
                    <span>Montos rápidos:</span>
                    {amount > suggestedAmount && (
                      <span className='text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold'>
                        <HeartHandshake className='h-3.5 w-3.5' /> +${(amount - suggestedAmount).toFixed(2)} voluntario
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-2 flex-wrap'>
                    {presetAmounts.map((val) => {
                      const isSelected = amount === val;
                      return (
                        <Button
                          key={val}
                          type='button'
                          variant={isSelected ? 'default' : 'outline'}
                          size='sm'
                          onClick={() => setAmount(val)}
                          className={`h-8.5 text-xs px-3.5 rounded-lg font-bold transition-all ${
                            isSelected
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm scale-105'
                              : 'bg-background hover:bg-emerald-500/10 hover:text-emerald-700 hover:border-emerald-500/40'
                          }`}
                        >
                          ${val.toFixed(2)}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Change Calculator Drawer Toggle */}
            {!isClosed && (
              <div className='rounded-xl border bg-muted/20 p-4 space-y-3'>
                <div className='flex items-center justify-between'>
                  <button
                    type='button'
                    onClick={() => setShowCalculator(!showCalculator)}
                    className='text-xs font-semibold text-foreground hover:text-primary flex items-center gap-2 transition-colors'
                  >
                    <Calculator className='h-4 w-4 text-primary' />
                    <span>{showCalculator ? 'Ocultar calculadora de vuelto' : '¿El socio pagó con billete grande? (Calcular vuelto)'}</span>
                  </button>
                  {showCalculator && (
                    <Badge variant='outline' className='text-[10px] text-muted-foreground px-2 py-0.5'>
                      Asistente de caja
                    </Badge>
                  )}
                </div>

                {showCalculator && (
                  <div className='pt-3 border-t space-y-3 animate-in fade-in-50 duration-200'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <span className='text-xs text-muted-foreground'>Billete entregado:</span>
                      {[1, 2, 5, 10, 20, 50].map((b) => (
                        <Button
                          key={b}
                          type='button'
                          variant={cashGiven === b ? 'default' : 'outline'}
                          size='sm'
                          onClick={() => setCashGiven(b)}
                          className='h-8 text-xs px-3 rounded-md font-semibold'
                        >
                          ${b}
                        </Button>
                      ))}
                      <Input
                        type='number'
                        placeholder='Otro $'
                        value={cashGiven}
                        onChange={(e) => setCashGiven(parseFloat(e.target.value) || '')}
                        className='h-8 w-24 text-xs px-2.5 rounded-md'
                      />
                    </div>

                    {typeof cashGiven === 'number' && cashGiven >= amount && (
                      <div className='flex items-center justify-between p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-950 dark:text-emerald-100'>
                        <span className='text-xs font-semibold'>Vuelto a entregar al socio:</span>
                        <span className='text-lg font-black text-emerald-700 dark:text-emerald-300'>
                          ${changeDue.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Notes & Quick Tags */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='payNotes' className='text-xs font-medium text-muted-foreground'>
                  Nota / Observación
                </Label>
                {!isClosed && (
                  <div className='flex items-center gap-1.5 overflow-x-auto'>
                    {COMMON_NOTES.map((n) => (
                      <button
                        key={n}
                        type='button'
                        onClick={() => setNotes(n)}
                        className={`text-[10px] px-2.5 py-1 rounded-full border transition-colors ${
                          notes === n
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Input
                id='payNotes'
                placeholder='Ej: Cobro en mesa, pagado por familiar...'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting || isClosed}
                className='h-10 text-xs px-3.5 rounded-xl'
              />
            </div>
          </div>

          {/* Footer with High-Contrast Action Button */}
          <DialogFooter className='px-7 py-4.5 border-t bg-muted/20 flex flex-row items-center justify-between gap-3.5 shrink-0'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isSubmitting}
              className='h-11 px-5 rounded-xl font-semibold'
            >
              {isClosed ? 'Cerrar ventana' : 'Cancelar'}
            </Button>

            {!isClosed && (
              <Button
                type='submit'
                className='flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20'
                disabled={isSubmitting || !activeContribution || amount <= 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Registrando cobro...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className='mr-2 size-4' />
                    Confirmar Cobro • ${amount.toFixed(2)}
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
