import { Person } from "./persons";

export interface Member {
  memberId:            string;
  houseNumber:         string;
  status:              'active' | 'inactive';
  person:             Person;
  memberDocumentTypes: any[];
  createdAt:           string;
}
