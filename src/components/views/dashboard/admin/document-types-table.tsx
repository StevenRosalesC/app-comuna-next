'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Icons } from '@/components/icons';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';
import { DocumentTypesTableRowSkeleton } from './document-types-table-row-skeleton';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { AlertModal } from '@/components/modal/alert-modal';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, RotateCw } from 'lucide-react';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentTypesService } from '@/services/document-types';
import { DocumentType } from '@/interfaces/document-types';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { useDebounce } from '@/hooks/use-debounce';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nombre es requerido' }),
  status: z.boolean()
});

type FormValue = z.infer<typeof formSchema>;

export default function DocumentTypesTable() {
  const { permissions } = usePermissionsStore();
  const queryClient = useQueryClient();
  const canCreateDocumentType = permissions?.[
    ValidModules.DOCUMENT_TYPES
  ]?.includes(ValidActions.CREATE);

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['documentTypes', { pageSize, pageIndex, debouncedSearch }],
    queryFn: () =>
      documentTypesService.list(pageSize, pageIndex * pageSize, debouncedSearch)
  });
  const documentTypes = useMemo(() => data?.data ?? [], [data]);
  const totalCount = useMemo(() => data?.count ?? 0, [data]);
  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editDocType, setEditDocType] = useState<DocumentType | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteDocType, setDeleteDocType] = useState<DocumentType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Edit form
  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', status: true }
  });

  // Add form
  const addForm = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', status: true }
  });

  // Reset page index when search changes
  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch]);

  // Mutation for editing
  const mutation = useMutation({
    mutationFn: async (data: FormValue) => {
      if (editDocType) {
        return documentTypesService.update(editDocType.documentTypeId, data);
      }
    },
    onSuccess: () => {
      toast.success('Tipo de documento actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['documentTypes'] });
      setModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error('Error al actualizar el tipo de documento');
    }
  });

  // Mutation for adding
  const addMutation = useMutation({
    mutationFn: async (data: FormValue) => {
      return documentTypesService.create(data);
    },
    onSuccess: () => {
      toast.success('Tipo de documento añadido correctamente');
      queryClient.invalidateQueries({ queryKey: ['documentTypes'] });
      setAddModalOpen(false);
      addForm.reset();
    },
    onError: () => {
      toast.error('Error al añadir el tipo de documento');
    }
  });

  // Open modal for edit
  const openEditModal = (docType: DocumentType) => {
    setEditDocType(docType);
    form.reset({
      name: docType.name,
      status: docType.status
    });
    setModalOpen(true);
  };

  // Handle edit form submission
  const onSubmit = (data: FormValue) => {
    mutation.mutate(data);
  };

  // Handle add form submission
  const onAddSubmit = (data: FormValue) => {
    addMutation.mutate(data);
  };

  // Delete document type
  const handleDelete = async () => {
    if (!deleteDocType) return;
    setIsDeleting(true);
    try {
      await documentTypesService.remove(deleteDocType.documentTypeId);
      toast.success('Tipo de documento eliminado correctamente');
      refetch();
      setDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar el tipo de documento');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Tipos de documentos</h2>
        <div className='flex gap-2'>
          {canCreateDocumentType && (
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className='mr-2 h-4 w-4' /> Nuevo tipo
            </Button>
          )}
          <Button
            onClick={() => refetch()}
            variant='outline'
            title='Recargar tipos de documentos'
            size='icon'
          >
            <RotateCw
              className={`h-4 w-4 ${isFetching ? 'animate-spin ' : ''}`}
            />
          </Button>
        </div>
      </div>

      <div className='mb-4'>
        <Input
          placeholder='Buscar por nombre...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-sm'
        />
      </div>

      <div className='mb-2 flex items-center justify-between'>
        <span className='text-sm text-muted-foreground'>
          {totalCount} registro{totalCount === 1 ? '' : 's'} en total.
        </span>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Alias</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <DocumentTypesTableRowSkeleton key={i} />
              ))
            ) : documentTypes && documentTypes.length > 0 ? (
              documentTypes.map((docType: DocumentType) => (
                <TableRow key={docType.documentTypeId}>
                  <TableCell className='font-medium'>{docType.name}</TableCell>
                  <TableCell className='text-muted-foreground'>
                    {docType.alias}
                  </TableCell>
                  <TableCell>
                    {docType.status ? (
                      <span className='font-semibold text-green-600'>
                        Activo
                      </span>
                    ) : (
                      <span className='text-gray-400'>Inactivo</span>
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => openEditModal(docType)}
                            title='Editar tipo de documento'
                          >
                            <Icons.edit className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setDeleteDocType(docType);
                              setDeleteModalOpen(true);
                            }}
                            title='Eliminar tipo de documento'
                          >
                            <Icons.trash className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Eliminar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center text-muted-foreground'
                >
                  No se encontraron tipos de documentos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination always visible, like annual fees table */}
      <div className='mt-2'>
        <DataTablePagination
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          isLoading={isLoading}
          onPageIndexChange={setPageIndex}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Add Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogTitle>Nuevo tipo de documento</DialogTitle>
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(onAddSubmit)}
              className='space-y-4'
            >
              <FormField
                control={addForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Cédula de identidad' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Estado</FormLabel>
                      <div className='text-sm text-muted-foreground'>
                        Activar o desactivar este tipo de documento
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' disabled={addMutation.isPending}>
                  {addMutation.isPending ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogTitle>Editar tipo de documento</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Cédula de identidad' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Estado</FormLabel>
                      <div className='text-sm text-muted-foreground'>
                        Activar o desactivar este tipo de documento
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' disabled={mutation.isPending}>
                  {mutation.isPending ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title='Eliminar tipo de documento'
        description={`¿Estás seguro de que quieres eliminar "${deleteDocType?.name}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
}
