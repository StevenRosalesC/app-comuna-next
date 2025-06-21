import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Person } from '@/interfaces/persons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requirementsService } from '@/services/requirements';
import { toast } from 'sonner';

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
    onSuccess: () => {
      toast.success('Requisito aprobado correctamente');
      queryClient.invalidateQueries({ queryKey: ['persons'] });
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
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar requisitos</DialogTitle>
            <DialogDescription>
              <p>
                {person.firstName} {person.lastName}
              </p>
              <p>
                {new Date(person.birthDate).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </p>
              <p>{person.gender === 1 ? 'Masculino' : 'Femenino'}</p>

              <div className='mt-4 flex flex-col gap-2'>
                {person.personRequirement?.map((personReq) => {
                  const isApproved = personReq.status === 'APPROVED';

                  return (
                    <div
                      key={personReq.requirement.requirementId}
                      className='flex items-center gap-2'
                    >
                      <p className='flex-1'>
                        {personReq.requirement.requirement}
                      </p>
                      <Button
                        size='sm'
                        disabled={isApproved || approveMutation.isPending}
                        onClick={() =>
                          handleApproveClick(
                            personReq.requirement.requirementId
                          )
                        }
                      >
                        {isApproved ? 'Aprobado' : 'Aprobar'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Modal de confirmación */}
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
