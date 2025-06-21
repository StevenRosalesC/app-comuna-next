import { Person } from "./persons";
import { MemberFee } from "./member-fee";

export interface Member {
  memberId:            string;
  personId:            string;
  houseNumber:         string;
  createdAt:           Date;
  status:              'active' | 'inactive';
  person:             Person;
  invoices:            any[];
  memberDocumentTypes: any[];
  memberFees?:         MemberFee[];
}
