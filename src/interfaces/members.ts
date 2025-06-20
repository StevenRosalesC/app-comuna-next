export interface Member {
  memberId: string;
  personId: string;
  lastName: string;
  firstName: string;
  houseNumber: string;
  joinDate: string;
  status: 'active' | 'inactive';
}