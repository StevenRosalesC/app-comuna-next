export type FundStatus = 'ACTIVE' | 'INACTIVE';
export type MovementType = 'INCOME' | 'EXPENSE';
export type FundMovementSourceType =
  | 'MANUAL_DEPOSIT'
  | 'COLLECTION_RETENTION'
  | 'MANUAL_WITHDRAWAL'
  | 'PROJECT_DISBURSEMENT'
  | string;

export interface Fund {
  fundId: string;
  name: string;
  description?: string | null;
  currentBalance: number;
  movementsCount?: number;
  status?: FundStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface FundMovement {
  movementId: string;
  fundId: string;
  type: MovementType;
  amount: number;
  concept: string;
  sourceType?: FundMovementSourceType;
  referenceId?: string | null;
  createdBy?: {
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | string;
  createdAt: string;
}

export interface CreateFundDto {
  name: string;
  description?: string;
}

export interface UpdateFundDto {
  name?: string;
  description?: string;
  status?: FundStatus;
}

export interface CreateFundMovementDto {
  type: MovementType;
  amount: number;
  concept: string;
  sourceType?: FundMovementSourceType;
  referenceId?: string;
}

export interface GetFundMovementsParams {
  limit?: number;
  offset?: number;
  type?: MovementType | string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface PaginatedFundsResponse {
  data: Fund[];
  count: number;
}

export interface PaginatedFundMovementsResponse {
  data: FundMovement[];
  count: number;
}
