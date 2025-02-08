import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TiptapEditor, { type TiptapEditorRef } from '@/components/TiptapEditor';
import { getPost, savePost } from '@/services/post';

interface PostForm {
  title: string;
  content: string;
}

export default function EditForm() {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { control, reset, watch } = useForm<PostForm>();

  const getWordCount = useCallback(
    () => editorRef.current?.getInstance()?.storage.characterCount.words() ?? 0,
    [editorRef.current]
  );

  useEffect(() => {
    getPost().then((post) => {
      reset({ ...post });
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const subscription = watch((values, { type }) => {
      if (type === 'change') {
        savePost({ ...values, wordCount: getWordCount() });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  if (isLoading) return;

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <label className='mb-2 inline-block font-medium dark:text-white'>
          Title
        </label>
        <Controller
          control={control}
          name='title'
          render={({ field }) => (
            <input
              {...field}
              type='text'
              className='w-full rounded-md border border-[#d1d9e0] bg-white px-4 py-2.5 shadow outline-none dark:border-[#3d444d] dark:bg-[#0d1017] dark:text-white'
              placeholder='Enter post title...'
            />
          )}
        />
      </div>

      <div>
        <label className='mb-2 inline-block font-medium dark:text-white'>
          Content
        </label>
        <Controller
          control={control}
          name='content'
          render={({ field }) => (
            <TiptapEditor
              ref={editorRef}
              ssr={true}
              output='html'
              placeholder={{
                paragraph: 'Type your content here...',
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
