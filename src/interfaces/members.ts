import { Person } from "./persons";
import { MemberFee } from "./member-fee";

export interface Member {
  memberId:            string;
  houseNumber:         string;
  status:              'active' | 'inactive';
  person:             Person;
  memberDocumentTypes: any[];
  memberFees?:         MemberFee[];
  createdAt:           string;
}
