'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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
import {
  Plus,
  RotateCw,
  Files,
  Loader2,
  Save,
  Sparkles,
  FileText,
  FileCheck,
  Pencil,
  Trash2
} from 'lucide-react';
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
    ValidModules.ADMIN
  ]?.includes(ValidActions.CREATE_DOCUMENT_TYPE);

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

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', status: true }
  });

  // Reset page index when search changes
  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch]);

  const mutation = useMutation({
    mutationFn: async (data: FormValue) => {
      if (editDocType) {
        return documentTypesService.update(editDocType.documentTypeId, data);
      } else {
        return documentTypesService.create(data);
      }
    },
    onSuccess: () => {
      toast.success(
        editDocType
          ? 'Tipo de documento actualizado correctamente'
          : 'Tipo de documento añadido correctamente'
      );
      queryClient.invalidateQueries({ queryKey: ['documentTypes'] });
      setModalOpen(false);
      setEditDocType(null);
      form.reset();
    },
    onError: () => {
      toast.error(
        editDocType
          ? 'Error al actualizar el tipo de documento'
          : 'Error al añadir el tipo de documento'
      );
    }
  });

  const openModal = (docType: DocumentType | null = null) => {
    setEditDocType(docType);
    if (docType) {
      form.reset({
        name: docType.name,
        status: docType.status
      });
    } else {
      form.reset({
        name: '',
        status: true
      });
    }
    setModalOpen(true);
  };

  const onSubmit = (data: FormValue) => {
    mutation.mutate(data);
  };

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
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-xl font-semibold tracking-tight'>
            Tipos de documentos
          </h2>
          <p className='text-sm text-muted-foreground'>
            Documentos oficiales admitidos para trámites y validación de comuneros.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {canCreateDocumentType && (
            <Button onClick={() => openModal(null)}>
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
          className='w-full sm:max-w-sm'
        />
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
                    <Badge variant={docType.status ? 'default' : 'secondary'}>
                      {docType.status ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => openModal(docType)}
                            title='Editar tipo de documento'
                          >
                            <Pencil className='h-4 w-4' />
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
                            <Trash2 className='h-4 w-4 text-destructive' />
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
                  className='h-24 text-center text-muted-foreground'
                >
                  No se encontraron tipos de documentos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='mt-4'>
        <div className='mb-2 text-center text-sm text-muted-foreground sm:text-left'>
          {totalCount} registros en total.
        </div>
        <DataTablePagination
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          isLoading={isLoading}
          onPageIndexChange={setPageIndex}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Unified Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className='sm:max-w-[480px] p-0 overflow-hidden'>
          {/* Enhanced Header */}
          <div className={`p-6 pb-4 border-b ${editDocType ? 'bg-amber-500/5' : 'bg-primary/5'}`}>
            <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-xs ${
                  editDocType
                    ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'border-primary/20 bg-primary/10 text-primary'
                }`}
              >
                {editDocType ? (
                  <FileText className='h-5 w-5' />
                ) : (
                  <Sparkles className='h-5 w-5' />
                )}
              </div>
              <div className='flex flex-1 flex-col gap-1'>
                <div className='flex items-center gap-2'>
                  <DialogTitle className='text-lg font-semibold tracking-tight'>
                    {editDocType ? 'Editar Tipo de Documento' : 'Nuevo Tipo de Documento'}
                  </DialogTitle>
                  <Badge
                    variant='outline'
                    className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 ${
                      editDocType
                        ? 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                        : 'border-primary/30 text-primary bg-primary/10'
                    }`}
                  >
                    {editDocType ? 'Edición' : 'Creación'}
                  </Badge>
                </div>
                <DialogDescription className='text-xs text-muted-foreground leading-relaxed'>
                  {editDocType
                    ? 'Actualiza el nombre y estado del documento oficial.'
                    : 'Registra un nuevo tipo de documento para trámites comunales.'}
                </DialogDescription>
              </div>
            </DialogHeader>
          </div>

          {/* Form Body */}
          <div className='p-6 pt-4'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-semibold'>
                        Nombre del documento <span className='text-destructive'>*</span>
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <FileCheck className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                          <Input
                            placeholder='Ej: Cédula de ciudadanía, Pasaporte, etc.'
                            className='pl-9'
                            autoFocus
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <p className='text-[11px] text-muted-foreground'>
                        Denominación oficial del documento aceptado.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-xl border bg-muted/30 p-3.5'>
                      <div className='space-y-0.5'>
                        <div className='flex items-center gap-2'>
                          <FormLabel className='text-sm font-medium'>Estado del Documento</FormLabel>
                          <Badge variant={field.value ? 'default' : 'secondary'} className='text-[10px] py-0'>
                            {field.value ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          Habilitar para recepción y carga en solicitudes
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
                <DialogFooter className='gap-2 sm:gap-0 pt-2 border-t mt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    disabled={mutation.isPending}
                    className={editDocType ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}
                  >
                    {mutation.isPending ? (
                      <Loader2 className='mr-2 size-4 animate-spin' />
                    ) : editDocType ? (
                      <Save className='mr-2 size-4' />
                    ) : (
                      <Plus className='mr-2 size-4' />
                    )}
                    {editDocType ? 'Guardar Cambios' : 'Crear Documento'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        confirmText='Eliminar'
        cancelText='Cancelar'
        title='Eliminar tipo de documento'
        description={`¿Estás seguro de que quieres eliminar "${deleteDocType?.name}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
}
