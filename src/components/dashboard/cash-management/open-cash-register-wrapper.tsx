'use client';

import OpenCashRegister from './open-cash-register';

interface OpenCashRegisterWrapperProps {
  onSuccess?: () => void;
}

export function OpenCashRegisterWrapper({ onSuccess }: OpenCashRegisterWrapperProps) {

  return (
    <OpenCashRegister canOpenCashRegister={true} />
  );
} 