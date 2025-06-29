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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import MemberPayment from '@/components/dashboard/members/member-payment';
import { PaymentHistoryTable } from '@/components/dashboard/members/payment-history-table';
import DocumentUpload from '@/components/dashboard/members/document-upload';
import { usePermission } from '@/hooks/usePermission';
import { ValidActions, ValidModules } from '@/constants/permissions';

// Skeleton component for better loading experience
function MemberPageSkeleton() {
  return (
    <div className='p-4 pt-6 md:p-8'>
      <div className='grid grid-cols-1 gap-6'>
        {/* Member Card Skeleton */}
        <Card>
          <CardHeader className='flex flex-col items-start gap-4 md:flex-row md:items-center'>
            <div className='flex-1'>
              <Skeleton className='h-8 w-64 mb-2' />
              <Skeleton className='h-6 w-48 mb-3' />
              <Skeleton className='h-6 w-20 rounded-full' />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {[1, 2, 3, 4, 5].map((row) => (
                  <TableRow key={row}>
                    <TableHead>
                      <Skeleton className='h-4 w-24' />
                    </TableHead>
                    <TableCell>
                      <Skeleton className='h-4 w-48' />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payment Section Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-32 mb-2' />
            <Skeleton className='h-4 w-80' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-10 w-36' />
          </CardContent>
        </Card>

        {/* Payment History Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-40 mb-2' />
            <Skeleton className='h-4 w-72' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {/* Table Header */}
              <div className='flex items-center justify-between'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-8 w-24' />
              </div>

              {/* Table */}
              <div className='overflow-x-auto rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><Skeleton className='h-4 w-20' /></TableHead>
                      <TableHead><Skeleton className='h-4 w-24' /></TableHead>
                      <TableHead><Skeleton className='h-4 w-20' /></TableHead>
                      <TableHead><Skeleton className='h-4 w-16' /></TableHead>
                      <TableHead><Skeleton className='h-4 w-20' /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3].map((row) => (
                      <TableRow key={row}>
                        <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                        <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                        <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                        <TableCell><Skeleton className='h-6 w-16 rounded-full' /></TableCell>
                        <TableCell><Skeleton className='h-8 w-20' /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className='flex items-center justify-between'>
                <Skeleton className='h-4 w-32' />
                <div className='flex gap-2'>
                  <Skeleton className='h-8 w-8' />
                  <Skeleton className='h-8 w-8' />
                  <Skeleton className='h-8 w-8' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Upload Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-36 mb-2' />
            <Skeleton className='h-4 w-64' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <Skeleton className='h-20 w-full rounded-lg border-2 border-dashed' />
              <div className='flex gap-2'>
                <Skeleton className='h-8 w-24' />
                <Skeleton className='h-8 w-20' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MemberPage({ params }: { params: { id: string } }) {
  const canReadHistoryPayments = usePermission(ValidModules.MEMBERS, [
    ValidActions.READ_HISTORY_PAYMENTS
  ]);
  const canCreatePayment = usePermission(ValidModules.MEMBERS, [
    ValidActions.CREATE_PAYMENT
  ]);
  const {
    data: member,
    isLoading,
    error
  } = useQuery({
    queryKey: ['members', params.id],
    queryFn: () => getMemberById(params.id)
  });

  if (isLoading) {
    return <MemberPageSkeleton />;
  }

  if (error) {
    toast.error('Error al obtener la información del comunero.');
    return (
      <div className='flex h-full items-center justify-center'>
        <p>No se pudo cargar la información del comunero.</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className='flex h-full items-center justify-center'>
        <p>Comunero no encontrado.</p>
      </div>
    );
  }

  const { person } = member;

  return (
    <div className='p-4 pt-6 md:p-8'>
      <div className='grid grid-cols-1 gap-6'>
        <Card>
          <CardHeader className='flex flex-col items-start gap-4 md:flex-row md:items-center'>
            <div className='flex-1'>
              <CardTitle className='text-3xl'>
                {person.firstName} {person.lastName}
              </CardTitle>
              <CardDescription className='text-lg'>
                {person.identification}
              </CardDescription>
              <Badge
                className={`mt-2 ${member.status ? 'bg-green-500' : 'bg-red-500'
                  }`}
              >
                {member.status ? 'Activo' : 'Inactivo'}
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
        {member && canCreatePayment && <MemberPayment member={member} />}
        {member && canReadHistoryPayments && (
          <PaymentHistoryTable memberId={member.memberId} />
        )}
        {/* Documents Section */}
        {member && <DocumentUpload memberId={member.memberId} />}
      </div>
    </div>
  );
}
