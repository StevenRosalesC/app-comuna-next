import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Person } from '@/interfaces/persons'
import { useRequirementsStore } from '@/hooks/store/useRequirementsStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ApproveRequirementsDialogProps {    
  person: Person
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ApproveRequirementsDialog = ({ person, open, onOpenChange }: ApproveRequirementsDialogProps) => {
  const { requirements, approveRequirement, loading, getRequirements } = useRequirementsStore();
  const [approved, setApproved] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<string | null>(null);
  const [observation, setObservation] = useState('');

  getRequirements();

  // get approved requirements ids
  const approvedIds = person.requirementApprovals?.map(r => r.requirementId) || [];
  // join approved requirements with approved requirements in this session
  const allApproved = new Set([...approvedIds, ...approved]);

  const handleApproveClick = (requirementId: string) => {
    setSelectedReq(requirementId);
    setObservation('');
    setConfirmOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (selectedReq) {
      await approveRequirement(person.personId, selectedReq, { observation });
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
                {new Date(person.birthDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
              <p>
                {person.gender === 1 ? 'Masculino' : 'Femenino'}
              </p>

              <div className="flex flex-col gap-2 mt-4">
                {
                  requirements.map((req) => {
                    const isApproved = allApproved.has(req.requirementId);
                    return (
                      <div key={req.requirementId} className="flex items-center gap-2">
                        <p className="flex-1">{req.requirement}</p>
                        <Button
                          size="sm"
                          disabled={loading || isApproved}
                          onClick={() => handleApproveClick(req.requirementId)}
                        >
                          {isApproved ? 'Aprobado' : 'Aprobar'}
                        </Button>
                      </div>
                    );
                  })
                }
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
          <div className="my-2">
            <label className="block text-sm font-medium mb-1">Observación (opcional)</label>
            <Input
              value={observation}
              onChange={e => setObservation(e.target.value)}
              placeholder="Escribe una observación..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmApprove} disabled={loading}>
              Aprobar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
