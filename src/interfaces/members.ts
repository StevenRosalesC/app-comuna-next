export interface Member {
  memberId: string;
  personId: string;
  fullName: string;
  houseNumber: string;
  joinDate: string;
  status: 'active' | 'inactive';
  documents: number;
  annualFeePaid: boolean;
  // Puedes agregar más campos según necesidades
} 