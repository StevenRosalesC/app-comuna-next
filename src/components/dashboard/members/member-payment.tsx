'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cashRegisterService } from '@/services/cash-register';
import { invoicingService } from '@/services/invoicing';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Member } from '@/interfaces/members';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

interface MemberPaymentProps {
  member: Member;
}

export default function MemberPayment({ member }: MemberPaymentProps) {
  const queryClient = useQueryClient();
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: activeCashRegister, isLoading: isLoadingCashRegister } =
    useQuery({
      queryKey: ['activeCashRegister'],
      queryFn: cashRegisterService.getActiveRegister,
      retry: 1
    });

  const createInvoiceMutation = useMutation({
    mutationFn: invoicingService.createInvoice,
    onSuccess: () => {
      toast.success('Pago registrado correctamente.');
      setSelectedFees([]);
      queryClient.invalidateQueries({ queryKey: ['members', member.memberId] });
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
      setIsModalOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || 'Error al registrar el pago.'
      );
    }
  });

  const pendingFees = useMemo(
    () => member?.memberFees?.filter((fee) => fee.status === 'PENDING') || [],
    [member]
  );

  const totalAmount = useMemo(() => {
    return pendingFees
      .filter((fee) => selectedFees.includes(fee.memberFeeId))
      .reduce((acc, fee) => acc + fee.annualFee.amount, 0);
  }, [pendingFees, selectedFees]);

  const handlePay = () => {
    if (selectedFees.length === 0) {
      toast.warning('Debes seleccionar al menos una cuota para pagar.');
      return;
    }
    createInvoiceMutation.mutate({
      memberId: member.memberId,
      memberFeeIds: selectedFees,
      cashRegisterId: activeCashRegister!.cashRegisterId
    });
  };

  if (pendingFees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pagos de Cuotas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            El miembro no tiene cuotas pendientes de pago.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos de Cuotas</CardTitle>
        <CardDescription>
          Selecciona las cuotas pendientes que deseas pagar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingCashRegister ? (
          <Skeleton className='h-10 w-36' />
        ) : activeCashRegister ? (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>Realizar Pago</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Pago</DialogTitle>
              </DialogHeader>
              <div className='space-y-2'>
                {pendingFees.map((fee) => (
                  <div
                    key={fee.memberFeeId}
                    className='flex items-center space-x-2'
                  >
                    <Checkbox
                      id={fee.memberFeeId}
                      checked={selectedFees.includes(fee.memberFeeId)}
                      onCheckedChange={(checked) => {
                        setSelectedFees((prev) =>
                          checked
                            ? [...prev, fee.memberFeeId]
                            : prev.filter((id) => id !== fee.memberFeeId)
                        );
                      }}
                    />
                    <label
                      htmlFor={fee.memberFeeId}
                      className='flex-1 cursor-pointer text-sm'
                    >
                      {fee.annualFee.name} - ${fee.annualFee.amount.toFixed(2)}
                    </label>
                  </div>
                ))}
              </div>
              <div className='mt-4 text-lg font-bold'>
                Total a pagar: ${totalAmount.toFixed(2)}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='ghost'>Cancelar</Button>
                </DialogClose>
                <Button
                  onClick={handlePay}
                  disabled={
                    createInvoiceMutation.isPending || selectedFees.length === 0
                  }
                >
                  {createInvoiceMutation.isPending
                    ? 'Procesando Pago...'
                    : 'Confirmar y Pagar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Alert variant='default'>
            <Icons.warning className='h-4 w-4' />
            <AlertTitle>No hay caja activa</AlertTitle>
            <AlertDescription>
              Es necesario abrir una caja en el módulo de &quot;Gestión de
              Caja&quot; para poder registrar pagos.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
