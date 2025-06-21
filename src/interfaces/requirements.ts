export interface Requirement {
  requirementId: string;
  requirement:   string;
  observation:   string;
  status:        boolean;
}

export type RequirementStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PersonRequirement {
  personRequirementId: string;
  status: RequirementStatus;
  observation?: string | null;
  requirement: Requirement;
}
