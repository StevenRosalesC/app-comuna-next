'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Upload, File, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { documentTypesService } from '@/services/document-types';
import { memberDocumentsService } from '@/services/member-documents';
import { usePermission } from '@/hooks/usePermission';
import { ValidActions, ValidModules } from '@/constants/permissions';

interface DocumentUploadProps {
  memberId: string;
  onDocumentUploaded?: () => void;
}

export default function DocumentUpload({
  memberId,
  onDocumentUploaded
}: DocumentUploadProps) {
  const canReadDocuments = usePermission(ValidModules.MEMBERS, [
    ValidActions.READ_DOCUMENTS
  ]);
  const canUploadDocuments = usePermission(ValidModules.MEMBERS, [
    ValidActions.UPLOAD_DOCUMENTS
  ]);

  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    string | undefined
  >(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Get all document types
  const { data: documentTypes, isLoading: loadingTypes } = useQuery({
    queryKey: ['documentTypes'],
    queryFn: () => documentTypesService.listAll()
  });

  // Get member documents
  const { data: memberDocuments, isLoading: loadingDocuments } = useQuery({
    queryKey: ['memberDocuments', memberId],
    queryFn: () => memberDocumentsService.getMemberDocuments(memberId)
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      documentTypeId
    }: {
      file: File;
      documentTypeId: string;
    }) => {
      return memberDocumentsService.uploadDocument(
        memberId,
        file,
        documentTypeId
      );
    },
    onSuccess: (_, { documentTypeId }) => {
      const isUpdate = isDocumentTypeUploaded(documentTypeId);
      toast.success(
        isUpdate
          ? 'Documento actualizado exitosamente'
          : 'Documento subido exitosamente'
      );
      queryClient.invalidateQueries({
        queryKey: ['memberDocuments', memberId]
      });
      setSelectedDocumentType(undefined);
      onDocumentUploaded?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al subir el documento');
    }
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: async (documentTypeId: string) => {
      return memberDocumentsService.downloadDocument(memberId, documentTypeId);
    },
    onSuccess: (blob, documentTypeId) => {
      const memberDocument = memberDocuments?.find(
        (doc) => doc.documentTypeId === documentTypeId
      );
      const fileName =
        memberDocument?.originalFileName || `document-${documentTypeId}`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Documento descargado exitosamente');
    },
    onError: () => {
      toast.error('Error al descargar el documento');
    }
  });

  // Filter available document types (exclude already uploaded ones)
  const availableDocumentTypes = useMemo(() => {
    if (!documentTypes) return [];
    return documentTypes;
  }, [documentTypes]);

  // Check if a document type is already uploaded
  const isDocumentTypeUploaded = useCallback(
    (documentTypeId: string) => {
      return (
        memberDocuments?.some((doc) => doc.documentTypeId === documentTypeId) ||
        false
      );
    },
    [memberDocuments]
  );

  // Handle file upload
  const handleFileUpload = useCallback(
    (file: File) => {
      if (!selectedDocumentType) {
        toast.error('Por favor selecciona un tipo de documento primero');
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          'Tipo de archivo no permitido. Solo se permiten PDF, imágenes, DOC y DOCX'
        );
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('El archivo es demasiado grande. Máximo 10MB');
        return;
      }

      setIsUploading(true);
      uploadMutation.mutate(
        { file, documentTypeId: selectedDocumentType },
        {
          onSettled: () => {
            setIsUploading(false);
          }
        }
      );
    },
    [selectedDocumentType, uploadMutation]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  // File input change handler
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFileUpload]
  );

  const handleDownload = (documentTypeId: string) => {
    downloadMutation.mutate(documentTypeId);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (loadingTypes || loadingDocuments) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documentos del Comunero</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-32 w-full' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos del Comunero</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Document Type Selection */}
        {canUploadDocuments && (
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Tipo de Documento</label>
            <Select
              value={selectedDocumentType}
              onValueChange={setSelectedDocumentType}
              disabled={isUploading || loadingTypes}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingTypes
                      ? 'Cargando tipos...'
                      : 'Selecciona un tipo de documento'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableDocumentTypes.length === 0 ? (
                  <SelectItem value='' disabled>
                    {loadingTypes
                      ? 'Cargando...'
                      : 'No hay tipos de documento disponibles'}
                  </SelectItem>
                ) : (
                  availableDocumentTypes.map((type) => {
                    const isUploaded = isDocumentTypeUploaded(
                      type.documentTypeId
                    );
                    return (
                      <SelectItem
                        key={type.documentTypeId}
                        value={type.documentTypeId}
                      >
                        <div className='flex w-full items-center justify-between'>
                          <span>{type.name}</span>
                          {isUploaded && (
                            <Badge variant='secondary' className='ml-2 text-xs'>
                              Subido
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
            {selectedDocumentType &&
              isDocumentTypeUploaded(selectedDocumentType) && (
                <p className='text-sm text-amber-600'>
                  ⚠️ Este documento ya está subido. Al subir un nuevo archivo,
                  reemplazará el existente.
                </p>
              )}
          </div>
        )}

        {/* Upload Area */}
        {selectedDocumentType && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
            className={`
              cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors
              ${isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25'
              }
              ${isUploading
                ? 'cursor-not-allowed opacity-50'
                : 'hover:border-primary/50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type='file'
              accept='.pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx'
              onChange={handleFileInputChange}
              className='hidden'
              disabled={isUploading}
            />
            <Upload className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
            {isUploading ? (
              <p className='text-sm text-muted-foreground'>
                Subiendo documento...
              </p>
            ) : isDragOver ? (
              <p className='text-sm text-primary'>Suelta el archivo aquí</p>
            ) : (
              <div>
                <p className='mb-2 text-sm text-muted-foreground'>
                  Arrastra y suelta un archivo aquí, o haz clic para seleccionar
                </p>
                <p className='text-xs text-muted-foreground'>
                  PDF, imágenes, DOC, DOCX (máximo 10MB)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Uploaded Documents */}
        {memberDocuments && memberDocuments.length > 0 && canReadDocuments && (
          <div className='space-y-2'>
            <h4 className='text-sm font-medium'>Documentos Subidos</h4>
            <div className='space-y-2'>
              {memberDocuments.map((document) => (
                <div
                  key={document.documentTypeId}
                  className='flex items-center justify-between rounded-lg border p-3'
                >
                  <div className='flex items-center space-x-3'>
                    <File className='h-5 w-5 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium'>
                        {document.documentType.name}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {document.originalFileName}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Actualizado:{' '}
                        {new Date(document.lastUpdate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDownload(document.documentTypeId)}
                    disabled={downloadMutation.isPending}
                  >
                    <Download className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Documents Message */}
        {memberDocuments && memberDocuments.length === 0 && (
          <div className='py-8 text-center text-muted-foreground'>
            <File className='mx-auto mb-4 h-12 w-12 opacity-50' />
            <p>No hay documentos subidos para este comunero</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
