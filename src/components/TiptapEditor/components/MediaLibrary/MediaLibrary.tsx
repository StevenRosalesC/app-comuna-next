import React, { useEffect, useRef, useState } from 'react';
import MediaGallery from './MediaGallery';
import Button from '@/components/TiptapEditor/components/ui/Button';

import './style.scss';
import { ImageData } from 'types/dashboard';

interface MediaLibraryProps {
  onInsert?: (image: ImageData) => void;
  onClose?: () => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onInsert, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [previews, setPreviews] = useState<ImageData[]>([]);
  const [selected, setSelected] = useState<ImageData | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    const confirmUpload = window.confirm(
      // "Please avoid uploading too many images unnecessarily to save storage space. Also, ensure your images comply with copyright rules. Do you wish to continue?
      'Por favor, evite subir demasiadas imágenes innecesariamente para ahorrar espacio de almacenamiento. Además, asegúrese de que sus imágenes cumplan con las reglas de derechos de autor. ¿Desea continuar?'
    );

    if (confirmUpload) {
      fileInput.current?.click();
    }
  };

  const loadImage = (file: File): Promise<ImageData> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        resolve({
          url,
          width: image.width,
          height: image.height,
          format: file.type.split('/')[1],
          display_name: file.name.split(/\.\w+$/)[0]
        });
      };
      image.src = url;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const previewPromises = Array.from(files).map(loadImage);
    const loadedPreviews = await Promise.all(previewPromises);
    setPreviews(loadedPreviews);

    const uploadPromises = Array.from(files).map((file, index) => {
      const preview = loadedPreviews[index];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);
      formData.append('folder', '/app-comuna/news-images');
      formData.append('width', String(preview.width));
      formData.append('height', String(preview.height));
      formData.append('format', preview.format);
      formData.append('display_name', preview.display_name);
      return fetch('/api/images', { method: 'POST', body: formData }).then((r) =>
        r.json()
      );
    });
    const uploadImages = await Promise.all(uploadPromises);
    loadedPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setPreviews([]);
    setImages((prev) => [...uploadImages, ...prev]);
    setUploading(false);
  };

  const handleFinish = () => selected !== null && onInsert?.(selected);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/images');
        const data = await response.json();
        setImages(data);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className='media-library'>
      <header className='media-library__header'>
        <h2>Biblioteca de medios</h2>
        <Button disabled={loading || uploading} onClick={handleUploadClick}>
          Subir imagen
        </Button>
      </header>

      <div className='media-library__content'>
        {loading ? (
          <div className='media-library__spinner' aria-label='Loading images' />
        ) : (
          <MediaGallery
            data={[...previews, ...images]}
            onSelect={(image) => {
              setSelected(image);
            }}
            selected={selected}
          />
        )}
      </div>

      <footer className='media-library__footer'>
        <Button
          variant='outline'
          className='media-library__btn media-library__btn--cancel'
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          className='media-library__btn media-library__btn--finish'
          disabled={!selected || loading || uploading}
          onClick={handleFinish}
        >
          Insertar
        </Button>
      </footer>

      <input
        style={{ display: 'none' }}
        type='file'
        multiple
        accept='image/*'
        ref={fileInput}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default MediaLibrary;
