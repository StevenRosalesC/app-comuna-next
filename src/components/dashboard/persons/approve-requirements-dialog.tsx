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
import { useQuery } from '@tanstack/react-query';
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
  const [approved, setApproved] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<string | null>(null);
  const [observation, setObservation] = useState('');

  const { data: requirements = [], isLoading } = useQuery({
    queryKey: ['requirements', 'all'],
    queryFn: requirementsService.listAll
  });

  useEffect(() => {
    if (open) {
      setApproved([]);
    }
  }, [open, person]);

  // get approved requirements ids
  const approvedIds =
    person.requirementApprovals?.map((r) => r.requirementId) || [];
  // join approved requirements with approved requirements in this session
  const allApproved = new Set([...approvedIds, ...approved]);

  const handleApproveClick = (requirementId: string) => {
    setSelectedReq(requirementId);
    setObservation('');
    setConfirmOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (selectedReq) {
      toast.promise(
        requirementsService.approve(person.personId, selectedReq, {
          observation
        }),
        {
          loading: 'Aprobando requisito...',
          success: 'Requisito aprobado correctamente',
          error: 'Error al aprobar el requisito'
        }
      );
      setApproved((prev) => [...prev, selectedReq]);
      setConfirmOpen(false);
      setObservation('');
      setSelectedReq(null);
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
                {requirements.map((req) => {
                  const isApproved = allApproved.has(req.requirementId);
                  return (
                    <div
                      key={req.requirementId}
                      className='flex items-center gap-2'
                    >
                      <p className='flex-1'>{req.requirement}</p>
                      <Button
                        size='sm'
                        disabled={isLoading || isApproved}
                        onClick={() => handleApproveClick(req.requirementId)}
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
            <Button onClick={handleConfirmApprove} disabled={isLoading}>
              Aprobar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
