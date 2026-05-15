import { PersonRequirement } from './requirements';

export interface IPersonsRequestResponse {
  data: Person[];
  count: number;
}

export interface Person {
  personId: string;
  identification: string;
  lastName: string;
  firstName: string;
  gender: number;
  phoneNumber: string;
  birthDate: Date;
  status: boolean;
  email: string;
  memberCount?: number;
  neighborhoodId: string | null;
  hasDisability?: boolean;
  disabilityPercentage?: number;
  personRequirement?: PersonRequirement[];
}

export interface IPerson {
  personId?: string;
  identification: string;
  lastName: string;
  firstName: string;
  gender: number;
  birthDate: string;
  neighborhoodId?: string | null;
  phoneNumber?: string;
  email?: string;
  hasDisability?: boolean;
  disabilityPercentage?: number;
}
