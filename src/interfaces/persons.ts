export interface IPersonsRequestResponse {
  data:  Person[];
  count: number;
}

export interface Person {
  personId:       string;
  identification: string;
  lastName:       string;
  firstName:      string;
  gender:         number;
  phoneNumber:    string;
  birthDate:      Date;
  status:         boolean;
  email:          string;
  neighborhoodId: string;
  requirementApprovals?: RequirementsApprovals[];
}

export interface IPerson {
  personId?: string;
  identification: string;
  lastName: string;
  firstName: string;
  gender: number;
  birthDate: string;
  neighborhoodId?: string;
  phoneNumber?: string;
  email?: string;
}
export interface ApprovedByUser {
  username:  string;
  userRoles: UserRoles;
  persons:   Persons;
}

export interface Persons {
  lastName:       string;
  firstName:      string;
  identification: string;
}

export interface UserRoles {
  name: string;
}


export interface RequirementsApprovals {
  approvalId:    string;
  approvalDate:  Date;
  observation:   string;
  personId:      string;
  requirementId: string;
  requirements:  Requirements;
  approvedByUser: ApprovedByUser;
}

export interface Requirements {
  requirementId: string;
  requirement:   string;
  observation:   string;
  status:        boolean;
}
