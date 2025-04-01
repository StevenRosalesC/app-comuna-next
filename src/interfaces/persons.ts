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
  phoneNumber:    null;
  birthDate:      Date;
  status:         boolean;
  email:          null;
  neighborhoodId: string;
}

export interface IPerson {
  identification: string;
  lastName: string;
  firstName: string;
  gender: number;
  birthDate: string;
  neighborhoodId?: string;
  phoneNumber?: string;
  email?: string;
}

