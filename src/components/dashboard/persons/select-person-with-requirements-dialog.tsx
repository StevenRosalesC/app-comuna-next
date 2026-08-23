'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { personsService } from '@/services/persons';
import { Person } from '@/interfaces/persons';
import { useDebounce } from './useDebounce';
import {
  Search,
  UserCheck,
  UserX,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  Check
} from 'lucide-react';

interface SelectPersonWithRequirementsDialogProps {
  onSelect: (person: Person) => void;
  triggerLabel?: string;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export function SelectPersonWithRequirementsDialog({
  onSelect,
  triggerLabel = 'Seleccionar persona'
}: SelectPersonWithRequirementsDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['persons-with-reqs', debouncedSearch, page, pageSize],
    queryFn: async () => {
      const response = await personsService.getAllWithAllRequirementsApproved({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search: debouncedSearch
      });
      return response;
    },
    enabled: open
  });

  const persons = data?.data || [];
  const totalCount = data?.count || 0;
  const pageCount = Math.max(Math.ceil(totalCount / pageSize), 1);

  const handleSelectPerson = (person: Person) => {
    onSelect(person);
    setOpen(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full justify-between sm:w-auto min-w-[240px] text-left font-normal'>
          <span className='truncate'>{triggerLabel}</span>
          <UserCheck className='ml-2 h-4 w-4 shrink-0 text-muted-foreground' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-3xl lg:max-w-4xl p-0 gap-0 overflow-hidden'>
        {/* Header */}
        <DialogHeader className='p-6 pb-4 border-b bg-muted/20'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0'>
              <UserCheck className='h-5 w-5' />
            </div>
            <div>
              <DialogTitle className='text-lg font-semibold'>
                Seleccionar persona para comunero
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground mt-0.5'>
                Solo se muestran personas que tienen todos los requisitos de membresía aprobados.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Search & Filter Bar */}
        <div className='p-4 border-b bg-background flex flex-col sm:flex-row items-center justify-between gap-3'>
          <div className='relative w-full sm:w-80'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Buscar por nombre, apellido o cédula...'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className='pl-9 pr-8 text-xs h-9'
            />
            {search && (
              <button
                type='button'
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className='absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                <X className='h-3.5 w-3.5' />
              </button>
            )}
          </div>

          <div className='flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end text-xs text-muted-foreground'>
            <span>Mostrar:</span>
            <select
              className='border rounded-md px-2.5 py-1.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary'
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} por pág.
                </option>
              ))}
            </select>
            {totalCount > 0 && (
              <Badge variant='secondary' className='text-[11px] font-normal py-0.5'>
                {totalCount} disponible{totalCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className='max-h-[380px] overflow-y-auto'>
          <Table>
            <TableHeader className='bg-muted/40 sticky top-0 z-10'>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='w-12 text-center text-xs font-semibold'>#</TableHead>
                <TableHead className='text-xs font-semibold'>Persona</TableHead>
                <TableHead className='text-xs font-semibold'>Cédula</TableHead>
                <TableHead className='text-xs font-semibold hidden md:table-cell'>Contacto</TableHead>
                <TableHead className='text-xs font-semibold text-center'>Requisitos</TableHead>
                <TableHead className='text-xs font-semibold text-right pr-4'>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i} className='animate-pulse'>
                    <TableCell className='text-center'><Skeleton className='h-4 w-4 mx-auto' /></TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Skeleton className='h-8 w-8 rounded-full' />
                        <div className='space-y-1.5'>
                          <Skeleton className='h-4 w-32' />
                          <Skeleton className='h-3 w-20' />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                    <TableCell className='hidden md:table-cell'><Skeleton className='h-4 w-28' /></TableCell>
                    <TableCell className='text-center'><Skeleton className='h-5 w-20 mx-auto rounded-full' /></TableCell>
                    <TableCell className='text-right pr-4'><Skeleton className='h-8 w-20 ml-auto rounded' /></TableCell>
                  </TableRow>
                ))
              ) : persons.length > 0 ? (
                persons.map((person, idx) => (
                  <TableRow
                    key={person.personId}
                    onClick={() => handleSelectPerson(person)}
                    className='cursor-pointer transition-colors hover:bg-primary/5 group'
                  >
                    <TableCell className='text-center text-xs text-muted-foreground font-mono'>
                      {(page - 1) * pageSize + idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0'>
                          {getInitials(person.firstName, person.lastName)}
                        </div>
                        <div>
                          <p className='font-medium text-foreground text-sm leading-tight'>
                            {person.firstName} {person.lastName}
                          </p>
                          <p className='text-[11px] text-muted-foreground mt-0.5'>
                            {person.gender === 1 ? 'Masculino' : 'Femenino'} • {new Date(person.birthDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='font-mono text-xs font-medium'>
                      {person.identification}
                    </TableCell>
                    <TableCell className='hidden md:table-cell text-xs text-muted-foreground'>
                      <div className='space-y-0.5'>
                        {person.email && (
                          <div className='flex items-center gap-1.5'>
                            <Mail className='h-3 w-3 shrink-0 opacity-70' />
                            <span className='truncate max-w-[140px]'>{person.email}</span>
                          </div>
                        )}
                        {person.phoneNumber && (
                          <div className='flex items-center gap-1.5'>
                            <Phone className='h-3 w-3 shrink-0 opacity-70' />
                            <span>{person.phoneNumber}</span>
                          </div>
                        )}
                        {!person.email && !person.phoneNumber && <span>-</span>}
                      </div>
                    </TableCell>
                    <TableCell className='text-center'>
                      <Badge
                        variant='secondary'
                        className='bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-200 gap-1 text-[11px] py-0.5'
                      >
                        <CheckCircle2 className='h-3 w-3 text-green-600 dark:text-green-400' />
                        Aprobados
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right pr-4'>
                      <Button
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPerson(person);
                        }}
                        className='h-8 text-xs gap-1 opacity-90 group-hover:opacity-100'
                      >
                        <Check className='h-3.5 w-3.5' />
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className='py-12'>
                    <div className='flex flex-col items-center justify-center gap-2 text-center max-w-sm mx-auto'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground'>
                        {search ? <Search className='h-6 w-6' /> : <UserX className='h-6 w-6' />}
                      </div>
                      <p className='text-sm font-semibold text-foreground mt-1'>
                        {search ? `Sin resultados para "${search}"` : 'No hay personas disponibles'}
                      </p>
                      <p className='text-xs text-muted-foreground leading-relaxed'>
                        {search
                          ? 'Verifica que la cédula o el nombre estén escritos correctamente.'
                          : 'Para registrar un nuevo comunero, primero debes aprobar los requisitos de la persona en el módulo de Personas.'}
                      </p>
                      {search && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setSearch('')}
                          className='mt-2 text-xs'
                        >
                          Limpiar búsqueda
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer with Pagination */}
        <div className='p-4 border-t bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs'>
          <span className='text-muted-foreground'>
            Página <strong className='text-foreground'>{page}</strong> de <strong className='text-foreground'>{pageCount}</strong> ({totalCount} personas encontradas)
          </span>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className='h-8 text-xs gap-1'
            >
              <ChevronLeft className='h-3.5 w-3.5' />
              Anterior
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page >= pageCount || totalCount === 0 || isLoading}
              className='h-8 text-xs gap-1'
            >
              Siguiente
              <ChevronRight className='h-3.5 w-3.5' />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
