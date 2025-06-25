'use client';

import { getMemberById } from '@/services/members';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import MemberPayment from '@/components/dashboard/members/member-payment';
import { PaymentHistoryTable } from '@/components/dashboard/members/payment-history-table';

export default function MemberPage({ params }: { params: { id: string } }) {
  const {
    data: member,
    isLoading,
    error
  } = useQuery({
    queryKey: ['members', params.id],
    queryFn: () => getMemberById(params.id)
  });

  if (isLoading) {
    return (
      <div className='p-4 pt-6 md:p-8'>
        <Skeleton className='h-32 w-full' />
        <Skeleton className='mt-4 h-8 w-1/2' />
        <Skeleton className='mt-4 h-48 w-full' />
      </div>
    );
  }

  if (error) {
    toast.error('Error al obtener la información del miembro.');
    return (
      <div className='flex h-full items-center justify-center'>
        <p>No se pudo cargar la información del miembro.</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className='flex h-full items-center justify-center'>
        <p>Miembro no encontrado.</p>
      </div>
    );
  }

  const { person } = member;

  return (
    <div className='p-4 pt-6 md:p-8'>
      <Card>
        <CardHeader className='flex flex-col items-start gap-4 md:flex-row md:items-center'>
          <Avatar className='h-24 w-24'>
            <AvatarImage
              src={'/avatar.jpg'}
              alt={`${person.firstName} ${person.lastName}`}
            />
            <AvatarFallback>
              {person.firstName.charAt(0)}
              {person.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <CardTitle className='text-3xl'>
              {person.firstName} {person.lastName}
            </CardTitle>
            <CardDescription className='text-lg'>
              {person.identification}
            </CardDescription>
            <Badge
              className={`mt-2 ${member.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`}
            >
              {member.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableCell>{person.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Teléfono</TableHead>
                <TableCell>{person.phoneNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Número de casa</TableHead>
                <TableCell>{member.houseNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Fecha de ingreso</TableHead>
                <TableCell>
                  {new Date(member.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Fecha de nacimiento</TableHead>
                <TableCell>
                  {new Date(person.birthDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {member && <MemberPayment member={member} />}
      {member && <PaymentHistoryTable memberId={member.memberId} />}
    </div>
  );
}
