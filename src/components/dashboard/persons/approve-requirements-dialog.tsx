import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Person } from '@/interfaces/persons';
import { Requirement, RequirementStatus } from '@/interfaces/requirements';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requirementsService } from '@/services/requirements';
import { toast } from 'sonner';
import { personsKeys } from '@/lib/queryKeys/persons';
import { CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface ApproveRequirementsDialogProps {
  person: Person;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApproveRequirementsDialog = ({
  person,
  open,
  onOpenChange
}: ApproveRequirementsDialogProps) => {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<string | null>(null);
  const [observation, setObservation] = useState('');
  const [locallyApprovedIds, setLocallyApprovedIds] = useState<Set<string>>(
    () => new Set()
  );

  const { data: allRequirements = [], isLoading: isLoadingRequirements } =
    useQuery<Requirement[]>({
      queryKey: ['requirements-all'],
      queryFn: () => requirementsService.listAll(),
      enabled: open
    });

  useEffect(() => {
    if (open) {
      const initialApproved = new Set<string>();
      person.personRequirement?.forEach((pr) => {
        if (pr.status === 'APPROVED') {
          const reqId =
            pr.requirement?.requirementId || (pr as any).requirementId;
          if (reqId) initialApproved.add(reqId);
        }
      });
      setLocallyApprovedIds(initialApproved);
    }
  }, [open, person.personId, person.personRequirement]);

  const approveMutation = useMutation({
    mutationFn: ({
      personId,
      requirementId,
      observation
    }: {
      personId: string;
      requirementId: string;
      observation: string;
    }) => requirementsService.approve(personId, requirementId, { observation }),
    onSuccess: (_, variables) => {
      toast.success('Requisito aprobado correctamente');
      setLocallyApprovedIds(
        (prev) => new Set([...Array.from(prev), variables.requirementId])
      );
      queryClient.invalidateQueries({ queryKey: personsKeys.all });
      queryClient.invalidateQueries({
        queryKey: ['dashboard-pending-requirements']
      });
    },
    onError: () => {
      toast.error('Error al aprobar el requisito');
    }
  });

  useEffect(() => {
    if (!open) {
      setConfirmOpen(false);
      setSelectedReq(null);
      setObservation('');
    }
  }, [open]);

  const combinedRequirements = useMemo(() => {
    const activeRequirements = allRequirements.filter(
      (req) => req.status !== false
    );

    if (activeRequirements.length > 0) {
      return activeRequirements.map((sysReq) => {
        const personReq = person.personRequirement?.find(
          (pr) =>
            pr.requirement?.requirementId === sysReq.requirementId ||
            (pr as any).requirementId === sysReq.requirementId
        );

        const isApprovedInProps = personReq?.status === 'APPROVED';
        const isApprovedLocally = locallyApprovedIds.has(sysReq.requirementId);
        const isApproved = isApprovedInProps || isApprovedLocally;

        const status: RequirementStatus = isApproved
          ? 'APPROVED'
          : personReq?.status || 'PENDING';
        const isRejected = !isApproved && personReq?.status === 'REJECTED';
        const reqObservation = personReq?.observation || null;
        const approvedByUser = personReq?.approvedByUser;

        return {
          requirementId: sysReq.requirementId,
          requirementName: sysReq.requirement,
          requirementObservation: sysReq.observation,
          status,
          isApproved,
          isRejected,
          observation: reqObservation,
          approvedByUser
        };
      });
    }

    return (person.personRequirement || []).map((personReq) => {
      const isApprovedInProps = personReq.status === 'APPROVED';
      const isApprovedLocally = locallyApprovedIds.has(
        personReq.requirement?.requirementId || (personReq as any).requirementId
      );
      const isApproved = isApprovedInProps || isApprovedLocally;

      const status: RequirementStatus = isApproved
        ? 'APPROVED'
        : personReq.status || 'PENDING';
      const isRejected = !isApproved && personReq.status === 'REJECTED';

      return {
        requirementId: personReq.requirement.requirementId,
        requirementName: personReq.requirement.requirement,
        requirementObservation: personReq.requirement.observation,
        status,
        isApproved,
        isRejected,
        observation: personReq.observation || null,
        approvedByUser: personReq.approvedByUser
      };
    });
  }, [allRequirements, person.personRequirement, locallyApprovedIds]);

  const totalCount = combinedRequirements.length;
  const approvedCount = combinedRequirements.filter((r) => r.isApproved).length;
  const pendingCount = totalCount - approvedCount;

  const handleApproveClick = (requirementId: string) => {
    setSelectedReq(requirementId);
    setObservation('');
    setConfirmOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (selectedReq) {
      approveMutation.mutate({
        personId: person.personId,
        requirementId: selectedReq,
        observation
      });
      setConfirmOpen(false);
      setSelectedReq(null);
      setObservation('');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Requisitos de membresía</DialogTitle>
            <DialogDescription>
              Revisa y gestiona la aprobación de requisitos para esta persona.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-2'>
            {/* Person Info & Progress Card */}
            <div className='rounded-lg border bg-muted/40 p-3 space-y-2 text-xs'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-semibold text-foreground text-sm'>
                    {person.firstName} {person.lastName}
                  </p>
                  <p className='text-muted-foreground'>
                    Cédula: {person.identification}
                  </p>
                </div>
                {totalCount > 0 && (
                  <Badge
                    variant={pendingCount === 0 ? 'default' : 'outline'}
                    className={
                      pendingCount === 0
                        ? 'bg-green-600 hover:bg-green-600 text-white'
                        : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                    }
                  >
                    {pendingCount === 0
                      ? 'Todos aprobados'
                      : `${pendingCount} pendiente${pendingCount > 1 ? 's' : ''}`}
                  </Badge>
                )}
              </div>
              <div className='flex items-center justify-between pt-1 border-t text-muted-foreground'>
                <span>
                  Progreso:{' '}
                  <strong className='text-foreground'>
                    {approvedCount}/{totalCount}
                  </strong>{' '}
                  aprobados
                </span>
                <span>
                  Género: {person.gender === 1 ? 'Masculino' : 'Femenino'}
                </span>
              </div>
            </div>

            {/* Requirements List */}
            {isLoadingRequirements ? (
              <div className='flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground'>
                <Loader2 className='h-5 w-5 animate-spin' />
                <span className='text-xs'>Cargando requisitos...</span>
              </div>
            ) : combinedRequirements.length > 0 ? (
              <div className='flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1'>
                {combinedRequirements.map((req) => (
                  <div
                    key={req.requirementId}
                    className={`flex items-center justify-between gap-3 rounded-lg border p-3 bg-card transition-colors ${
                      req.isApproved
                        ? 'border-green-200 dark:border-green-900 bg-green-50/20'
                        : ''
                    }`}
                  >
                    <div className='flex-1 min-w-0 space-y-1'>
                      <div className='flex items-center gap-2'>
                        {req.isApproved ? (
                          <CheckCircle2 className='h-4 w-4 text-green-600 shrink-0' />
                        ) : req.isRejected ? (
                          <AlertCircle className='h-4 w-4 text-destructive shrink-0' />
                        ) : (
                          <Clock className='h-4 w-4 text-amber-500 shrink-0' />
                        )}
                        <p className='text-sm font-medium text-foreground truncate'>
                          {req.requirementName}
                        </p>
                      </div>

                      {req.requirementObservation && (
                        <p className='text-xs text-muted-foreground pl-6'>
                          {req.requirementObservation}
                        </p>
                      )}

                      {req.observation && (
                        <p className='text-[11px] text-amber-700 dark:text-amber-400 pl-6'>
                          Nota: {req.observation}
                        </p>
                      )}

                      {req.approvedByUser && (
                        <p className='text-[11px] text-muted-foreground pl-6'>
                          Aprobado por:{' '}
                          {req.approvedByUser.person?.firstName || ''}{' '}
                          {req.approvedByUser.person?.lastName || ''}
                        </p>
                      )}
                    </div>

                    <div className='flex items-center gap-2 shrink-0'>
                      {req.isApproved ? (
                        <Badge
                          variant='secondary'
                          className='bg-green-100 text-green-800 border-green-200 text-xs py-0.5'
                        >
                          Aprobado
                        </Badge>
                      ) : (
                        <Button
                          size='sm'
                          variant='default'
                          disabled={approveMutation.isPending}
                          onClick={() => handleApproveClick(req.requirementId)}
                          className='h-8 text-xs'
                        >
                          Aprobar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-6 text-center text-muted-foreground'>
                <p className='text-sm'>
                  No hay requisitos configurados en el sistema.
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Puedes crear nuevos requisitos en el Panel de Administración.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar aprobación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de aprobar este requisito?
            </DialogDescription>
          </DialogHeader>
          <div className='my-2'>
            <label className='mb-1 block text-sm font-medium'>
              Observación (opcional)
            </label>
            <Input
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder='Escribe una observación...'
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmApprove}
              disabled={approveMutation.isPending}
            >
              Aprobar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
