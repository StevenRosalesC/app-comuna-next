import { Member } from './members';

export type CollectionReasonType = 'HEALTH' | 'DEATH' | 'OTHER';
export type CollectionStatus = 'ACTIVE' | 'CLOSED';
export type ContributionStatus = 'PENDING' | 'PAID' | 'ANNOUNCED';
export type DiscountType = 'NONE' | 'SENIOR' | 'DISABILITY';

export interface CollectionSummary {
  totalExpected: number;
  totalCollected: number;
  retainedForFund: number;
  netForBeneficiary: number;
  countTotal: number;
  countPending: number;
  countPaid: number;
  countAnnounced: number;
}

export interface Collection {
  collectionId: string;
  title: string;
  reasonType: CollectionReasonType;
  beneficiaryMemberId?: string | null;
  beneficiaryName: string;
  referenceMemberId?: string | null;
  beneficiaryRelation?: string | null;
  baseAmount: number;
  destinationFundId?: string | null;
  fundRetentionPercentage?: number;
  collectionStatus: CollectionStatus;
  startDate?: string;
  endDate?: string;
  notes?: string;
  summary?: CollectionSummary;
  destinationFund?: {
    fundId: string;
    name: string;
  };
  beneficiaryMember?: Member;
  referenceMember?: Member;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contribution {
  contributionId: string;
  collectionId: string;
  memberId?: string | null;
  isExternal: boolean;
  externalDonorName?: string | null;
  amount: number;
  suggestedAmount?: number;
  contributionStatus: ContributionStatus;
  discountType?: DiscountType;
  discountPercentage?: number;
  notes?: string;
  paidAt?: string;
  paidBy?: {
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | string;
  announcedAt?: string;
  announcedBy?: {
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | string;
  member?: {
    memberId: string;
    houseNumber?: string;
    status?: any;
    person: {
      personId?: string;
      identification: string;
      firstName: string;
      lastName: string;
      birthDate?: string | Date;
      hasDisability?: boolean;
      disabilityPercentage?: number;
      neighborhoodId?: string | null;
      neighborhood?: {
        neighborhoodId: string;
        neighborhoodName: string;
      };
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCollectionDto {
  title: string;
  reasonType: CollectionReasonType;
  beneficiaryMemberId?: string | number | null;
  beneficiaryName: string;
  referenceMemberId?: string | number | null;
  beneficiaryRelation?: string | null;
  baseAmount: number;
  destinationFundId?: string | null;
  fundRetentionPercentage?: number;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface UpdateCollectionDto extends Partial<CreateCollectionDto> {
  collectionStatus?: CollectionStatus;
}

export interface PayContributionDto {
  amount: number;
  notes?: string;
}

export interface CreateExternalContributionDto {
  externalDonorName: string;
  amount: number;
  notes?: string;
}

export interface CloseCollectionDto {
  fundRetentionPercentage: number;
  destinationFundId?: string | null;
  notes?: string;
}

export interface GetCollectionsParams {
  limit?: number;
  offset?: number;
  search?: string;
  collectionStatus?: CollectionStatus | string;
  reasonType?: CollectionReasonType | string;
}

export interface GetContributionsParams {
  limit?: number;
  offset?: number;
  search?: string;
  neighborhoodId?: string;
  contributionStatus?: ContributionStatus | string;
  isExternal?: boolean;
}

export interface PaginatedCollectionsResponse {
  data: Collection[];
  count: number;
}

export interface PaginatedContributionsResponse {
  data: Contribution[];
  count: number;
}
