'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { IoCloudUploadOutline } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';
import { ImageData } from 'types/dashboard';
import { isLocalImageUrl } from '@/utils/isLocalImageUrl';

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
    null
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const image = event.target.files[0];
      handleImageUpload(image);
    }
  };

  const removeSelectedImage = () => {
    setLoading(false);
    setUploadedImagePath(null);
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      img.src = url;
    });
  };

  const handleImageUpload = async (image: File) => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', image);
    formData.append('filename', image.name);
    formData.append('folder', '/app-comuna/news-images');

    try {
      const { width, height } = await getImageDimensions(image);
      formData.append('width', String(width));
      formData.append('height', String(height));
      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        const res: ImageData = await response.json();
        setLoading(false);
        setUploadedImagePath(res.url);
        if (onUploadComplete) {
          onUploadComplete(res.url);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const image = acceptedFiles[0];
      handleImageUpload(image);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true
  });

  return (
    <div className='h-full space-y-3'>
      <div {...getRootProps()} className='h-full'>
        <label
          htmlFor='dropzone-file'
          className='dark:hover:bg-bray-800 visually-hidden-focusable relative flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'
        >
          {loading && (
            <div className='max-w-md text-center'>
              <p className='text-sm font-semibold'>Uploading Picture</p>
              <p className='text-xs text-gray-400'>
                Do not refresh or perform any other action while the picture is
                being uploaded
              </p>
            </div>
          )}

          {!loading && !uploadedImagePath && (
            <div className='text-center'>
              <div className='mx-auto max-w-min rounded-md border p-2'>
                <IoCloudUploadOutline size='1.6em' />
              </div>

              <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                <span className='font-semibold'>Drag an image</span>
              </p>
              <p className='text-xs text-gray-400 dark:text-gray-400'>
                Select a image or drag here to upload directly
              </p>
            </div>
          )}

          {uploadedImagePath && !loading && (
            <div className='space-y-2 text-center'>
              <Image
                width={1000}
                height={1000}
                src={uploadedImagePath}
                className='max-h-16 w-full object-contain opacity-70'
                alt='uploaded image'
                unoptimized={isLocalImageUrl(uploadedImagePath)}
              />
              <div className='space-y-1'>
                <p className='text-sm font-semibold'>Image Uploaded</p>
                <p className='text-xs text-gray-400'>
                  Click here to upload another image
                </p>
              </div>
            </div>
          )}
        </label>

        <Input
          {...getInputProps()}
          id='dropzone-file'
          accept='image/png, image/jpeg'
          type='file'
          className='hidden'
          disabled={loading || uploadedImagePath !== null}
          onChange={handleImageChange}
        />
      </div>

      {!!uploadedImagePath && (
        <div className='flex items-center justify-between'>
          <Link
            href={uploadedImagePath}
            className=' text-xs text-gray-500 hover:underline '
          >
            Click here to see uploaded image :D
          </Link>

          <Button
            onClick={removeSelectedImage}
            type='button'
            variant='secondary'
          >
            {uploadedImagePath ? 'Remove' : 'Close'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
