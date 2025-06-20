import { Person } from "./persons";

export interface Member {
  memberId:            string;
  personId:            string;
  houseNumber:         string;
  createdAt:           Date;
  status:              'active' | 'inactive';
  persons:             Person;
  invoices:            any[];
  memberDocumentTypes: any[];
}
