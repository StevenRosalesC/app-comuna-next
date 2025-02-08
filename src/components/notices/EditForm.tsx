import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TiptapEditor, { type TiptapEditorRef } from "@/components/TiptapEditor";
import { savePost } from "@/services/post";
import { getNotice } from "@/services/notices";
import ImageUpload from "../image-upload";
import Image from "next/image";

interface PostForm {
  title: string;
  content: string;
  cover: string;

}

interface Props {
  id: string;
}

export default function EditForm({ id }: Props) {
  const editorRef = useRef<TiptapEditorRef>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { control, reset, watch } = useForm<PostForm>();

  const getWordCount = useCallback(
    () => editorRef.current?.getInstance()?.storage.characterCount.words() ?? 0,
    []
  );

  useEffect(() => {
    getNotice(id).then((notice) => {
      reset({ ...notice });
      console.log({ notice });
      setIsLoading(false);
    });
  }, [id, reset]);

  useEffect(() => {
    const subscription = watch((values, { type }) => {
      if (type === "change") {
        savePost({ ...values, wordCount: getWordCount() });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  if (isLoading) return;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="inline-block font-medium dark:text-white mb-2">Título</label>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="w-full px-4 py-2.5 shadow border border-[#d1d9e0] rounded-md bg-white dark:bg-[#0d1017] dark:text-white dark:border-[#3d444d] outline-none"
              placeholder="Enter post title..."
            />
          )}
        />
        <Controller
          control={control}
          name="cover"
          render={({ field }) => (
            <div className="w-full h-64 flex flex-col md:flex-row gap-2 justify-between my-2">
              <ImageUpload
                onUploadComplete={(url) => field.onChange(url)}
              />
              <Image
                src={field.value}
                alt="Cover image"
                width={640}
                height={320}
                className="rounded-md object-cover aspect-video"
              />
            </div>
          )}
        />
      </div>

      <div>
        <label className="inline-block font-medium dark:text-white mb-2">
          Contenido
        </label>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <TiptapEditor
              ref={editorRef}
              ssr={true}
              output="html"
              placeholder={{
                paragraph: "Escribe tu noticia aquí...",
                imageCaption: "Type caption for image (optional)",
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
