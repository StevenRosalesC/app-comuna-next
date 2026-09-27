'use client';

import { useState } from 'react';
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
import { toast } from 'sonner';
import { PiggyBank, Loader2, Sparkles } from 'lucide-react';
import { fundsService } from '@/services/funds';

interface CreateFundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateFundDialog({
  open,
  onOpenChange,
  onSuccess
}: CreateFundDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onOpenChange(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre del fondo es obligatorio');
      return;
    }

    setIsSubmitting(true);
    try {
      await fundsService.createFund({
        name: name.trim(),
        description: description.trim() || undefined
      });
      toast.success('¡Fondo comunitario creado exitosamente!');
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Error al crear el fondo comunitario'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden'>
        <div className='p-5 pb-4 border-b bg-emerald-500/10 text-emerald-950 dark:text-emerald-50'>
          <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'>
              <PiggyBank className='h-5 w-5' />
            </div>
            <div className='flex flex-1 flex-col gap-0.5'>
              <DialogTitle className='text-base font-semibold'>
                Nuevo Fondo Comunitario
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground'>
                Crea un fondo comunal permanente para retenciones y presupuestos específicos.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='p-5 space-y-4 text-sm'>
            <div className='space-y-1.5'>
              <Label htmlFor='fundName' className='font-semibold text-xs'>
                Nombre del Fondo <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='fundName'
                placeholder='Ej: Fondo Común, Fondo de Agua Potable, Fondo Pro-Obras'
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='fundDescription' className='font-semibold text-xs'>
                Descripción / Finalidad
              </Label>
              <Textarea
                id='fundDescription'
                placeholder='Ej: Destinado al mantenimiento de infraestructura y apoyo en emergencias comunales...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className='p-4 border-t bg-muted/20 gap-2 sm:gap-0'>
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
              className='bg-emerald-600 hover:bg-emerald-700 text-white'
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? (
                <Loader2 className='mr-2 size-4 animate-spin' />
              ) : (
                <Sparkles className='mr-2 size-4' />
              )}
              Crear Fondo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
