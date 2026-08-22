'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  description,
  confirmText = 'Continuar',
  cancelText = 'Cancelar',
  variant = 'destructive'
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onChange = (open: boolean) => {
    if (!open && !loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className='sm:max-w-[420px]'>
        <DialogHeader className='flex flex-col items-center gap-3 text-center sm:items-start sm:text-left'>
          <div className='flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <AlertTriangle className='size-5' />
          </div>
          <div>
            <DialogTitle className='text-lg font-semibold'>{title}</DialogTitle>
            <DialogDescription className='mt-1 text-sm text-muted-foreground'>
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className='mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
          <Button
            type='button'
            disabled={loading}
            variant='outline'
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            type='button'
            disabled={loading}
            variant={variant}
            onClick={onConfirm}
          >
            {loading && <Loader2 className='mr-2 size-4 animate-spin' />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

