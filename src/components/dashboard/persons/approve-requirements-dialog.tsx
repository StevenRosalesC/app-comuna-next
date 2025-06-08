import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog'
import { Person } from '@/interfaces/persons'

interface ApproveRequirementsDialogProps {    
  person: Person
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ApproveRequirementsDialog = ({ person, open, onOpenChange }: ApproveRequirementsDialogProps) => {
  return (
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

            <div className="flex flex-col gap-2">
              {
                person.requirementApprovals?.map((requirement) => (
                  <div key={requirement.requirements.requirementId}>
                    <p>{requirement.requirements.requirement}</p>
                  </div>
                ))  
              }
            </div>  
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
