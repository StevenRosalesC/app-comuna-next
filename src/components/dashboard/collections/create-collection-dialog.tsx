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
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  HeartHandshake,
  Loader2,
  Users,
  UserCheck,
  User,
  Percent,
  DollarSign,
  AlertCircle,
  Calendar,
  Sparkles,
  Search
} from 'lucide-react';
import { collectionsService } from '@/services/collections';
import { fundsService } from '@/services/funds';
import { getMembers } from '@/services/members';
import { Member } from '@/interfaces/members';
import { Fund } from '@/interfaces/funds';
import { CollectionReasonType } from '@/interfaces/collections';

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type BeneficiaryType = 'MEMBER' | 'MEMBER_FAMILY' | 'EXTERNAL';

export function CreateCollectionDialog({
  open,
  onOpenChange,
  onSuccess
}: CreateCollectionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [beneficiaryType, setBeneficiaryType] = useState<BeneficiaryType>('MEMBER');

  // Form states
  const [title, setTitle] = useState('');
  const [reasonType, setReasonType] = useState<CollectionReasonType>('HEALTH');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryMemberId, setBeneficiaryMemberId] = useState<string>('');
  const [referenceMemberId, setReferenceMemberId] = useState<string>('');
  const [beneficiaryRelation, setBeneficiaryRelation] = useState('');
  const [baseAmount, setBaseAmount] = useState<number>(5.0);
  const [destinationFundId, setDestinationFundId] = useState<string>('');
  const [fundRetentionPercentage, setFundRetentionPercentage] = useState<number>(10);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Search & Async Data
  const [members, setMembers] = useState<Member[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Load funds
  useEffect(() => {
    if (open) {
      fundsService
        .getFunds()
        .then((data) => {
          setFunds(data);
          const defaultFund = data.find((f) =>
            f.name.toLowerCase().includes('común') || f.name.toLowerCase().includes('comun')
          );
          if (defaultFund) {
            setDestinationFundId(defaultFund.fundId);
          } else if (data.length > 0) {
            setDestinationFundId(data[0].fundId);
          }
        })
        .catch(() => {});
    }
  }, [open]);

  // Load members
  useEffect(() => {
    if (open) {
      setLoadingMembers(true);
      getMembers(100, 0, memberSearch, [])
        .then((res) => setMembers(res.data || []))
        .catch(() => setMembers([]))
        .finally(() => setLoadingMembers(false));
    }
  }, [open, memberSearch]);

  const handleMemberSelect = (memberId: string) => {
    const selected = members.find((m) => m.memberId === memberId);
    if (selected) {
      setBeneficiaryMemberId(memberId);
      const fullName = `${selected.person?.firstName || ''} ${selected.person?.lastName || ''}`.trim();
      setBeneficiaryName(fullName);
    }
  };

  const handleReferenceMemberSelect = (memberId: string) => {
    setReferenceMemberId(memberId);
  };

  const resetForm = () => {
    setTitle('');
    setReasonType('HEALTH');
    setBeneficiaryType('MEMBER');
    setBeneficiaryName('');
    setBeneficiaryMemberId('');
    setReferenceMemberId('');
    setBeneficiaryRelation('');
    setBaseAmount(5.0);
    setFundRetentionPercentage(10);
    setStartDate('');
    setEndDate('');
    setNotes('');
    setMemberSearch('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onOpenChange(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('El título de la colecta es obligatorio');
      return;
    }

    if (!beneficiaryName.trim()) {
      toast.error('El nombre del beneficiario es obligatorio');
      return;
    }

    if (beneficiaryType === 'MEMBER' && !beneficiaryMemberId) {
      toast.error('Selecciona el comunero beneficiario');
      return;
    }

    if (baseAmount <= 0) {
      toast.error('La cuota base debe ser mayor a 0');
      return;
    }

    setIsSubmitting(true);
    try {
      await collectionsService.createCollection({
        title: title.trim(),
        reasonType,
        beneficiaryMemberId:
          beneficiaryType === 'MEMBER' && beneficiaryMemberId ? beneficiaryMemberId : null,
        beneficiaryName: beneficiaryName.trim(),
        referenceMemberId:
          beneficiaryType === 'MEMBER_FAMILY' && referenceMemberId
            ? referenceMemberId
            : null,
        beneficiaryRelation:
          beneficiaryType === 'MEMBER_FAMILY' && beneficiaryRelation.trim()
            ? beneficiaryRelation.trim()
            : null,
        baseAmount: Number(baseAmount),
        destinationFundId: destinationFundId || null,
        fundRetentionPercentage: Number(fundRetentionPercentage),
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        notes: notes.trim() || undefined
      });

      toast.success('¡Colecta creada exitosamente!');
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Ocurrió un error al crear la colecta'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[700px] p-0 overflow-hidden max-h-[92vh] flex flex-col'>
        {/* Header */}
        <div className='p-6 pb-4 border-b bg-primary/5 shrink-0'>
          <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs'>
              <HeartHandshake className='h-6 w-6' />
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <DialogTitle className='text-lg font-semibold tracking-tight'>
                Nueva Colecta Solidaria
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground'>
                Crea una colecta solidaria comunal y configura las cuotas y retenciones.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className='flex flex-col flex-1 overflow-hidden'>
          <div className='p-6 space-y-5 overflow-y-auto flex-1 text-sm'>
            {/* Title & Reason */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <div className='sm:col-span-2 space-y-1.5'>
                <Label htmlFor='title' className='font-semibold text-xs'>
                  Título de la Colecta <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='title'
                  placeholder='Ej: Colecta Solidaria para Familia Gómez'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='reasonType' className='font-semibold text-xs'>
                  Motivo <span className='text-destructive'>*</span>
                </Label>
                <Select
                  value={reasonType}
                  onValueChange={(val) => setReasonType(val as CollectionReasonType)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id='reasonType'>
                    <SelectValue placeholder='Seleccionar motivo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='HEALTH'>Salud / Enfermedad</SelectItem>
                    <SelectItem value='DEATH'>Fallecimiento</SelectItem>
                    <SelectItem value='OTHER'>Otro motivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Beneficiary Type Tabs */}
            <div className='space-y-3 rounded-xl border bg-muted/20 p-4'>
              <div className='flex items-center justify-between'>
                <Label className='font-semibold text-xs'>
                  Tipo de Beneficiario <span className='text-destructive'>*</span>
                </Label>
              </div>

              <Tabs
                value={beneficiaryType}
                onValueChange={(val) => {
                  setBeneficiaryType(val as BeneficiaryType);
                  setBeneficiaryName('');
                  setBeneficiaryMemberId('');
                  setReferenceMemberId('');
                  setBeneficiaryRelation('');
                }}
                className='w-full'
              >
                <TabsList className='grid grid-cols-3 w-full'>
                  <TabsTrigger value='MEMBER' className='text-xs flex items-center gap-1.5'>
                    <UserCheck className='h-3.5 w-3.5' />
                    Comunero (Socio)
                  </TabsTrigger>
                  <TabsTrigger value='MEMBER_FAMILY' className='text-xs flex items-center gap-1.5'>
                    <Users className='h-3.5 w-3.5' />
                    Familiar de Socio
                  </TabsTrigger>
                  <TabsTrigger value='EXTERNAL' className='text-xs flex items-center gap-1.5'>
                    <User className='h-3.5 w-3.5' />
                    Persona Externa
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Tab 1: Member */}
              {beneficiaryType === 'MEMBER' && (
                <div className='space-y-3 pt-2'>
                  <div className='space-y-1.5'>
                    <Label className='text-xs font-medium'>
                      Seleccionar Comunero Registrado
                    </Label>
                    <Select
                      value={beneficiaryMemberId}
                      onValueChange={handleMemberSelect}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Buscar comunero...' />
                      </SelectTrigger>
                      <SelectContent className='max-h-56'>
                        {loadingMembers ? (
                          <div className='p-3 text-center text-xs text-muted-foreground'>
                            Cargando comuneros...
                          </div>
                        ) : members.length === 0 ? (
                          <div className='p-3 text-center text-xs text-muted-foreground'>
                            No se encontraron comuneros
                          </div>
                        ) : (
                          members.map((m) => (
                            <SelectItem key={m.memberId} value={m.memberId}>
                              {m.person?.lastName} {m.person?.firstName} (CI:{' '}
                              {m.person?.identification} - Casa: {m.houseNumber || 'S/N'})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-300'>
                    <AlertCircle className='h-4 w-4 shrink-0 mt-0.5' />
                    <span>
                      <strong>Auto-exoneración:</strong> Este comunero será exonerado
                      automáticamente de la cuota de colaboración en esta colecta.
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Family of Member */}
              {beneficiaryType === 'MEMBER_FAMILY' && (
                <div className='space-y-3 pt-2'>
                  <div className='space-y-1.5'>
                    <Label className='text-xs font-medium'>Comunero de Referencia</Label>
                    <Select
                      value={referenceMemberId}
                      onValueChange={handleReferenceMemberSelect}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Buscar socio de referencia...' />
                      </SelectTrigger>
                      <SelectContent className='max-h-56'>
                        {members.map((m) => (
                          <SelectItem key={m.memberId} value={m.memberId}>
                            {m.person?.lastName} {m.person?.firstName} (CI:{' '}
                            {m.person?.identification})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div className='space-y-1.5'>
                      <Label htmlFor='famBeneficiaryName' className='text-xs font-medium'>
                        Nombre del Familiar <span className='text-destructive'>*</span>
                      </Label>
                      <Input
                        id='famBeneficiaryName'
                        placeholder='Ej: María Gómez'
                        value={beneficiaryName}
                        onChange={(e) => setBeneficiaryName(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className='space-y-1.5'>
                      <Label htmlFor='famRelation' className='text-xs font-medium'>
                        Parentesco / Relación
                      </Label>
                      <Input
                        id='famRelation'
                        placeholder='Ej: Madre del comunero'
                        value={beneficiaryRelation}
                        onChange={(e) => setBeneficiaryRelation(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: External Person */}
              {beneficiaryType === 'EXTERNAL' && (
                <div className='space-y-2 pt-2'>
                  <Label htmlFor='extBeneficiaryName' className='text-xs font-medium'>
                    Nombre Completo del Beneficiario <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='extBeneficiaryName'
                    placeholder='Ej: Juan Pérez'
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>

            {/* Base Amount & Discount notice */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='baseAmount' className='font-semibold text-xs'>
                  Cuota Base para Comuneros ($) <span className='text-destructive'>*</span>
                </Label>
                <span className='text-xs text-muted-foreground'>
                  3ra edad y discapacidad: ${(baseAmount * 0.5).toFixed(2)} (50%)
                </span>
              </div>
              <div className='relative'>
                <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  id='baseAmount'
                  type='number'
                  step='0.50'
                  min='0.50'
                  placeholder='5.00'
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(parseFloat(e.target.value) || 0)}
                  className='pl-9 font-semibold'
                  disabled={isSubmitting}
                />
              </div>
              <p className='text-[11px] text-muted-foreground'>
                * Los adultos mayores (≥65 años) y personas con discapacidad cancelarán
                automáticamente el 50% ($
                {(baseAmount * 0.5).toFixed(2)}).
              </p>
            </div>

            {/* Destination Fund & Retention Percentage */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border bg-card p-4'>
              <div className='space-y-1.5'>
                <Label htmlFor='destinationFund' className='font-semibold text-xs'>
                  Fondo Destino de Retención
                </Label>
                <Select
                  value={destinationFundId}
                  onValueChange={setDestinationFundId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id='destinationFund'>
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

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label className='font-semibold text-xs'>
                    Porcentaje para Fondo Comunal
                  </Label>
                  <span className='font-bold text-xs text-primary'>
                    {fundRetentionPercentage}%
                  </span>
                </div>
                <Slider
                  value={[fundRetentionPercentage]}
                  onValueChange={(vals) => setFundRetentionPercentage(vals[0])}
                  min={0}
                  max={100}
                  step={1}
                  disabled={isSubmitting}
                />
                <div className='flex justify-between text-[10px] text-muted-foreground'>
                  <span>0% (Todo para familia)</span>
                  <span>10% (Estándar)</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Dates & Notes */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-1.5'>
                <Label htmlFor='startDate' className='text-xs font-medium'>
                  Fecha de Inicio
                </Label>
                <Input
                  id='startDate'
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='endDate' className='text-xs font-medium'>
                  Fecha de Finalización Estimada
                </Label>
                <Input
                  id='endDate'
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='notes' className='text-xs font-medium'>
                Observaciones / Notas Adicionales
              </Label>
              <Textarea
                id='notes'
                placeholder='Detalles adicionales del caso o acuerdos comunales...'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className='p-4 border-t bg-muted/20 shrink-0 gap-2 sm:gap-0'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isSubmitting || !title.trim() || !beneficiaryName.trim()}>
              {isSubmitting ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : (
                <Sparkles className='mr-2 size-4' />
              )}
              Crear Colecta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
