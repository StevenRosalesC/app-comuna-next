import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog'
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
          <DialogTitle>Approve Requirements</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
