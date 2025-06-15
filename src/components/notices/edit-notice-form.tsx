'use client';
// import { useCallback, useEffect, useRef, useState } from 'react';
import TiptapEditor, { type TiptapEditorRef } from '@/components/TiptapEditor';
import { createNotice, getNotice, updateNotice } from '@/services/notices';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { notFound, usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Button } from '../ui/button';
import Dialog from '../TiptapEditor/components/ui/Dialog';
import MediaLibrary from '../TiptapEditor/components/MediaLibrary';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { NoticeType } from 'types/notices';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Link } from 'next-view-transitions';
import { usePermissionsStore } from '@/store/permissionsStore';
import { ValidActions, ValidModules } from '@/constants/permissions';

interface PostForm {
  title: string;
  content: string;
  coverImageUrl: string;
  description: string;
  type: NoticeType;
  published: boolean;
}

interface Props {
  id?: string;
}

export default function EditNoticeForm({ id }: Props) {
  const { permissions } = usePermissionsStore();
  const canCreateNotice = permissions?.[ValidModules.NOTICES]?.includes(
    ValidActions.CREATE
  );
  const editorRef = useRef<TiptapEditorRef>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const { control, reset, watch } = useForm<PostForm>({
    defaultValues: {
      title: '',
      content: '',
      coverImageUrl: '',
      description: '',
      type: NoticeType.Noticia,
      published: false
    }
  });

  const pathname = usePathname();
  const router = useRouter();

  const handleClose = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const create = async (notice: PostForm) => {
    try {
      const newNotice = await createNotice(notice);
      toast.success('Noticia creada');
      return newNotice;
    } catch (error) {
      toast.error('Error al crear la noticia');
    }
  };

  const update = async (id: string, notice: PostForm) => {
    try {
      const response = await updateNotice(id, notice);
      toast.success('Noticia actualizada');
      return response;
    } catch (error) {
      toast.error('Error al actualizar la noticia');
    }
  };

  useEffect(() => {
    if (id) {
      getNotice(id)
        .then((notice) => {
          reset({ ...notice });
          setIsLoading(false);
        })
        .catch((err) => {
          // redirect to 404 page
          router.push('/dashboard/notices');
        });
    } else {
      setIsLoading(false);
    }
  }, [id, reset, router]);

  useEffect(() => {
    const subscription = watch((values, { type }) => {
      if (type === 'change') {
        if (!values.title || !values.description || !values.content) return;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
          if (pathname.includes('create')) {
            if (!values.title || !values.description || !values.content) return;
            const notice = await create({
              title: values.title || '',
              content: values.content || '',
              coverImageUrl: values.coverImageUrl || '',
              description: values.description || '',
              type: values.type || NoticeType.Noticia,
              published: values.published ?? false
            });
            if (notice) {
              router.push(`/dashboard/notices/${notice.title}`);
            }
          } else if (id) {
            if (!values.title || !values.description || !values.content) return;
            await update(id, {
              title: values.title || '',
              content: values.content || '',
              coverImageUrl: values.coverImageUrl || '',
              description: values.description || '',
              type: values.type || NoticeType.Noticia,
              published: values.published ?? false
            });
          }
        }, 5000);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watch, pathname, id, router]);

  if (isLoading)
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
      </div>
    );

  if (!canCreateNotice) return notFound();

  return (
    <div className='container mx-auto px-4 py-6 '>
      <div className='space-y-8'>
        {/* Header con controles principales */}
        <div className='flex flex-col items-start justify-between gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center'>
          <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
            <Controller
              control={control}
              name='type'
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue>{field.value}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipo</SelectLabel>
                      {Object.values(NoticeType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              control={control}
              name='published'
              render={({ field }) => (
                <div className='flex items-center gap-2'>
                  <Label htmlFor='published'>Publicado</Label>
                  <Switch
                    id='published'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </div>
          <div className='flex gap-2'>
            {id && (
              <Button variant='outline' asChild>
                <Link href={`/dashboard/notices/${id}/preview`}>
                  Previsualizar
                </Link>
              </Button>
            )}
            <Button
              onClick={async () => {
                if (!id) return;
                await update(id, {
                  title: watch('title'),
                  description: watch('description'),
                  coverImageUrl: watch('coverImageUrl') || '',
                  content: watch('content'),
                  type: watch('type'),
                  published: watch('published')
                });
              }}
            >
              Guardar
            </Button>
          </div>
        </div>

        {/* Formulario principal */}
        <div className='space-y-6'>
          {/* Título */}
          <div className='space-y-2'>
            <Label className='text-base font-semibold'>Título</Label>
            <Controller
              control={control}
              name='title'
              render={({ field }) => (
                <Input
                  {...field}
                  type='text'
                  className='w-full'
                  placeholder='Ingrese el título de la noticia...'
                />
              )}
            />
          </div>

          {/* Imagen de portada */}
          <div className='space-y-4'>
            <Label className='text-base font-semibold'>Imagen de portada</Label>
            <Controller
              control={control}
              name='coverImageUrl'
              render={({ field }) => (
                <div className='space-y-4'>
                  <div className='relative aspect-video w-full overflow-hidden rounded-lg border bg-muted'>
                    <Image
                      src={field.value || '/not-found-1.webp'}
                      alt='Cover image'
                      fill
                      className='object-cover'
                    />
                  </div>
                  <Button
                    variant='outline'
                    onClick={() => setOpenDialog(true)}
                    className='w-full sm:w-auto'
                  >
                    Seleccionar imagen
                  </Button>
                  <Dialog
                    key='media-library'
                    open={openDialog}
                    onOpenChange={handleClose}
                  >
                    <MediaLibrary
                      key='media-library-content'
                      onClose={handleClose}
                      onInsert={(image) => {
                        field.onChange(image.url);
                        handleClose();
                      }}
                    />
                  </Dialog>
                </div>
              )}
            />
          </div>

          {/* Descripción */}
          <div className='space-y-2'>
            <Label className='text-base font-semibold'>Descripción</Label>
            <Controller
              control={control}
              name='description'
              render={({ field }) => (
                <Textarea
                  {...field}
                  className='min-h-[100px]'
                  placeholder='Ingrese la descripción de la noticia...'
                />
              )}
            />
          </div>

          {/* Editor de contenido */}
          <div className='space-y-2'>
            <Label className='text-base font-semibold'>Contenido</Label>
            <Controller
              control={control}
              name='content'
              render={({ field }) => (
                <div className='rounded-lg border'>
                  <TiptapEditor
                    ref={editorRef}
                    ssr={true}
                    output='html'
                    placeholder={{
                      paragraph: 'Escribe tu noticia aquí...',
                      imageCaption: 'Type caption for image (optional)'
                    }}
                    contentMinHeight={256}
                    contentMaxHeight={640}
                    onContentChange={field.onChange}
                    initialContent={field.value}
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
