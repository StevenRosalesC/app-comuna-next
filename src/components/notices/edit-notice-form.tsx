'use client';
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
import { isLocalImageUrl } from '@/utils/isLocalImageUrl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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

const NOTICE_CREATE_DRAFT_KEY = 'notices:create:draft:v1';

export default function EditNoticeForm({ id }: Props) {
  const { permissions } = usePermissionsStore();
  const canCreateNotice = permissions?.[ValidModules.NOTICES]?.includes(
    ValidActions.CREATE
  );
  const editorRef = useRef<TiptapEditorRef>(null);
  const draftTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [saveState, setSaveState] = useState<
    'idle' | 'pending' | 'saving' | 'saved' | 'error'
  >('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [draftState, setDraftState] = useState<'idle' | 'dirty' | 'saved'>(
    'idle'
  );
  const [lastDraftAt, setLastDraftAt] = useState<Date | null>(null);
  const [draftHydrated, setDraftHydrated] = useState(false);

  const { control, reset, watch, getValues, formState } = useForm<PostForm>({
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
  const isCreateMode = pathname.includes('create');

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

  const handleSave = useCallback(async () => {
    const values = getValues();
    if (!values.title || !values.description || !values.content) {
      toast.error('Completa título, descripción y contenido para guardar');
      return;
    }

    setSaveState('saving');
    if (isCreateMode) {
      const notice = await create({
        title: values.title || '',
        content: values.content || '',
        coverImageUrl: values.coverImageUrl || '',
        description: values.description || '',
        type: values.type || NoticeType.Noticia,
        published: values.published ?? false
      });
      if (notice) {
        try {
          localStorage.removeItem(NOTICE_CREATE_DRAFT_KEY);
        } catch {}
        setSaveState('saved');
        setLastSavedAt(new Date());
        router.push(`/dashboard/notices/${notice.title}`);
      } else {
        setSaveState('error');
      }
      return;
    }

    if (!id) return;
    const response = await update(id, {
      title: values.title || '',
      content: values.content || '',
      coverImageUrl: values.coverImageUrl || '',
      description: values.description || '',
      type: values.type || NoticeType.Noticia,
      published: values.published ?? false
    });
    if (response) {
      setSaveState('saved');
      setLastSavedAt(new Date());
    } else {
      setSaveState('error');
    }
  }, [create, getValues, id, isCreateMode, router]);

  useEffect(() => {
    if (id) {
      getNotice(id)
        .then((notice) => {
          if (!notice) {
            router.push('/dashboard/notices');
            return;
          }

          const resolvedType = Object.values(NoticeType).includes(
            notice.type as NoticeType
          )
            ? (notice.type as NoticeType)
            : NoticeType.Noticia;

          const nextValues: PostForm = {
            title: notice.title ?? '',
            content: notice.content ?? '',
            coverImageUrl: notice.coverImageUrl ?? '',
            description: notice.description ?? '',
            type: resolvedType,
            published: notice.published ?? false
          };

          reset(nextValues);
          setIsLoading(false);
          setSaveState('idle');
        })
        .catch((_err) => {
          router.push('/dashboard/notices');
        });
    } else {
      setIsLoading(false);
    }
  }, [id, reset, router]);

  useEffect(() => {
    if (!isCreateMode) return;
    try {
      const raw = localStorage.getItem(NOTICE_CREATE_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<
          PostForm & { __savedAt?: number }
        >;
        const nextValues: PostForm = {
          title: parsed.title ?? '',
          content: parsed.content ?? '',
          coverImageUrl: parsed.coverImageUrl ?? '',
          description: parsed.description ?? '',
          type: parsed.type ?? NoticeType.Noticia,
          published: parsed.published ?? false
        };
        reset(nextValues);
        setDraftState('saved');
        if (parsed.__savedAt) setLastDraftAt(new Date(parsed.__savedAt));
      }
    } catch {}
    setDraftHydrated(true);
  }, [isCreateMode, reset]);

  useEffect(() => {
    if (!isCreateMode || !draftHydrated) return;

    const subscription = watch((values, { type }) => {
      if (type !== 'change') return;
      if (draftTimeoutRef.current) clearTimeout(draftTimeoutRef.current);
      setDraftState('dirty');

      draftTimeoutRef.current = setTimeout(() => {
        try {
          const payload = { ...values, __savedAt: Date.now() };
          localStorage.setItem(NOTICE_CREATE_DRAFT_KEY, JSON.stringify(payload));
          setDraftState('saved');
          setLastDraftAt(new Date(payload.__savedAt));
        } catch {}
      }, 300);
    });

    return () => {
      subscription.unsubscribe();
      if (draftTimeoutRef.current) clearTimeout(draftTimeoutRef.current);
    };
  }, [draftHydrated, isCreateMode, watch]);

  if (isLoading)
    return (
      <div className='mx-auto w-full max-w-6xl px-4 py-6'>
        <div className='space-y-6'>
          <Skeleton className='h-[92px] w-full rounded-xl' />
          <div className='grid gap-6 lg:grid-cols-3'>
            <div className='space-y-6 lg:col-span-2'>
              <Skeleton className='h-[220px] w-full rounded-xl' />
              <Skeleton className='h-[520px] w-full rounded-xl' />
            </div>
            <Skeleton className='h-[420px] w-full rounded-xl' />
          </div>
        </div>
      </div>
    );

  if (!canCreateNotice) return notFound();

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6'>
      <div className='space-y-6'>
        <Card>
          <CardHeader className='gap-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0'>
            <div className='space-y-1'>
              <h1 className='text-xl font-semibold leading-none tracking-tight'>
                {isCreateMode ? 'Crear noticia' : 'Editar noticia'}
              </h1>
              <CardDescription>
                {isCreateMode
                  ? 'Se guarda un borrador en este navegador para no perder el progreso.'
                  : 'Guarda los cambios cuando estés listo.'}
              </CardDescription>
            </div>
            <div className='flex flex-col items-start gap-2 sm:items-end'>
              {saveState === 'error' ? (
                <Badge variant='destructive'>Error al guardar</Badge>
              ) : saveState === 'saving' ? (
                <Badge variant='secondary'>Guardando…</Badge>
              ) : saveState === 'saved' ? (
                <Badge variant='secondary'>
                  Guardado{lastSavedAt ? ` · ${lastSavedAt.toLocaleTimeString()}` : ''}
                </Badge>
              ) : isCreateMode ? (
                draftState === 'dirty' ? (
                  <Badge variant='outline'>Borrador sin guardar</Badge>
                ) : draftState === 'saved' ? (
                  <Badge variant='secondary'>
                    Borrador guardado
                    {lastDraftAt ? ` · ${lastDraftAt.toLocaleTimeString()}` : ''}
                  </Badge>
                ) : (
                  <Badge variant='outline'>Listo</Badge>
                )
              ) : formState.isDirty ? (
                <Badge variant='outline'>Cambios sin guardar</Badge>
              ) : (
                <Badge variant='outline'>Listo</Badge>
              )}
              <div className='flex flex-wrap gap-2'>
                <Button variant='outline' asChild>
                  <Link href='/dashboard/notices'>Volver</Link>
                </Button>
                {id && (
                  <Button variant='outline' asChild>
                    <Link href={`/dashboard/notices/${id}/preview`}>
                      Previsualizar
                    </Link>
                  </Button>
                )}
                <Button onClick={handleSave} disabled={saveState === 'saving'}>
                  Guardar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                <Controller
                  control={control}
                  name='type'
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className='w-full sm:w-[220px]'>
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
              <div className='text-sm text-muted-foreground'>
                {isCreateMode ? (
                  <>
                    Borrador local
                    {lastDraftAt ? ` · ${lastDraftAt.toLocaleTimeString()}` : ''}
                  </>
                ) : (
                  'Guardado manual'
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>Detalles</CardTitle>
                <CardDescription>
                  Define el título y una breve descripción.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='notice-title'>Título</Label>
                  <Controller
                    control={control}
                    name='title'
                    render={({ field }) => (
                      <Input
                        {...field}
                        id='notice-title'
                        type='text'
                        className='w-full'
                        placeholder='Ingrese el título de la noticia...'
                      />
                    )}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='notice-description'>Descripción</Label>
                  <Controller
                    control={control}
                    name='description'
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id='notice-description'
                        className='min-h-[120px]'
                        placeholder='Ingrese la descripción de la noticia...'
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contenido</CardTitle>
                <CardDescription>
                  Escribe el contenido principal y agrega imágenes si lo necesitas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='overflow-hidden rounded-lg border'>
                  <Controller
                    control={control}
                    name='content'
                    render={({ field }) => (
                      <TiptapEditor
                        ref={editorRef}
                        ssr={true}
                        output='html'
                        placeholder={{
                          paragraph: 'Escribe tu noticia aquí...',
                          imageCaption: 'Type caption for image (optional)'
                        }}
                        contentMinHeight={320}
                        contentMaxHeight={720}
                        onContentChange={field.onChange}
                        initialContent={field.value}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className='h-fit'>
            <CardHeader>
              <CardTitle>Imagen de portada</CardTitle>
              <CardDescription>
                Recomendado 16:9 para una mejor visualización.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Controller
                control={control}
                name='coverImageUrl'
                render={({ field }) => (
                  <>
                    <div className='relative aspect-video w-full overflow-hidden rounded-lg border bg-muted'>
                      <Image
                        src={field.value || '/not-found-1.webp'}
                        alt='Cover image'
                        fill
                        className='object-cover'
                        unoptimized={isLocalImageUrl(field.value)}
                      />
                    </div>
                    <Button
                      variant='outline'
                      onClick={() => setOpenDialog(true)}
                      className='w-full'
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
                  </>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
