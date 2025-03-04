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
import { usePathname, useRouter } from 'next/navigation';
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

  if (isLoading) return;

  return (
    <div className='flex flex-col gap-6'>
      {/* buttons to save and delete notice */}
      <div className='flex w-full justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
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
              <>
                <Label htmlFor='published'>Publicado</Label>
                <Switch
                  id='published'
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </>
            )}
          />
        </div>
        <div className='gap4 flex flex-row'>
          {id && (
            <Link
              href={`/dashboard/notices/${id}/preview`}
              className='rounded-md bg-blue-500 px-4 py-2 text-white'
            >
              Previsualizar
            </Link>
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
      <div>
        <label className='mb-2 inline-block font-medium dark:text-white'>
          Título
        </label>
        <Controller
          control={control}
          name='title'
          render={({ field }) => (
            <Input
              {...field}
              type='text'
              className='w-full rounded-md border border-[#d1d9e0] bg-white px-4 py-2.5 shadow outline-none dark:border-[#3d444d] dark:bg-[#0d1017] dark:text-white'
              placeholder='Ingrese el título de la noticia...'
            />
          )}
        />

        <Controller
          control={control}
          name='coverImageUrl'
          render={({ field }) => {
            return (
              <div className='mt-4 flex w-full flex-col items-center gap-4'>
                <Label className='mb-2 inline-block font-medium dark:text-white'>
                  Imagen de portada
                </Label>

                <Image
                  src={field.value || '/not-found-1.webp'}
                  alt='Cover image'
                  width={400}
                  height={200}
                  className='mx-auto aspect-video rounded-md object-cover '
                />
                <Button
                  onClick={() => setOpenDialog(true)}
                  className='w-full md:w-1/3'
                >
                  Seleccionar imagen
                </Button>
                <Dialog
                  key={'media-library'}
                  open={openDialog}
                  onOpenChange={handleClose}
                >
                  <MediaLibrary
                    key={'media-library-content'}
                    onClose={handleClose}
                    onInsert={(image) => {
                      field.onChange(image.url);
                      handleClose();
                    }}
                  />
                </Dialog>
              </div>
            );
          }}
        />
      </div>

      <div>
        <Label className='mb-2 inline-block font-medium dark:text-white'>
          Descripción
        </Label>
        <Controller
          control={control}
          name='description'
          render={({ field }) => (
            <Textarea
              {...field}
              className='w-full rounded-md border border-[#d1d9e0] bg-white px-4 py-2.5 shadow outline-none dark:border-[#3d444d] dark:bg-[#0d1017] dark:text-white'
              placeholder='Ingrese la descripción de la noticia...'
            />
          )}
        />
      </div>

      <div>
        <Label className='mb-2 inline-block font-medium dark:text-white'>
          Contenido
        </Label>
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
              contentMinHeight={256}
              contentMaxHeight={640}
              onContentChange={field.onChange}
              initialContent={field.value}
            />
          )}
        />
      </div>
    </div>
  );
}
