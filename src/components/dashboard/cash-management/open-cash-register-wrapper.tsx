'use client';

import { useQueryClient } from '@tanstack/react-query';
import OpenCashRegister from './open-cash-register';

interface OpenCashRegisterWrapperProps {
  onSuccess?: () => void;
}

export function OpenCashRegisterWrapper({ onSuccess }: OpenCashRegisterWrapperProps) {
  const queryClient = useQueryClient();

  // Override the default mutation to call onSuccess
  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
    onSuccess?.();
  };

  return (
    <OpenCashRegister canOpenCashRegister={true} />
  );
} 