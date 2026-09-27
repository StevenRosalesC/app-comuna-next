'use client';

import OpenCashRegister from './open-cash-register';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';

interface OpenCashRegisterWrapperProps {
  onSuccess?: () => void;
}

export function OpenCashRegisterWrapper({ onSuccess }: OpenCashRegisterWrapperProps) {
  const { permissions } = usePermissionsStore();
  const canOpenCashRegister = permissions?.[ValidModules.CASH_MANAGEMENT]?.includes(
    ValidActions.OPEN_CASH_REGISTER
  ) ?? true;

  return (
    <OpenCashRegister canOpenCashRegister={canOpenCashRegister} onSuccess={onSuccess} />
  );
}