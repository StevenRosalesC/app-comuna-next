export interface Requirement {
  requirementId: string;
  requirement: string;
  observation: string;
  status: boolean;
}

export type RequirementStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PersonRequirement {
  personRequirementId: string;
  status: RequirementStatus;
  observation?: string | null;
  requirement: Requirement;
  approvedByUser?: ApprovedByUser;
}
export interface ApprovedByUser {
  username: string;
  role: Role;
  person: Person;
}

export interface Person {
  lastName: string;
  firstName: string;
  identification: string;
}

export interface Role {
  name: string;
}
