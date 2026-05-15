import React from 'react';
import { LuCheck } from 'react-icons/lu';
import clsx from 'clsx';
import Image from 'next/image';
import { isLocalImageUrl } from '@/utils/isLocalImageUrl';

interface MediaGalleryProps {
  data: any[];
  selected: any | null;
  onSelect: (image: any) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  data,
  selected,
  onSelect
}) => {
  const items = Array.isArray(data)
    ? data.filter((image) => image && typeof image.url === 'string')
    : [];

  return (
    <div className='media-gallery'>
      {items.map((image, index) => {
        const displayName =
          typeof image?.display_name === 'string' ? image.display_name : '';
        const width = typeof image?.width === 'number' ? image.width : 1;
        const height = typeof image?.height === 'number' ? image.height : 1;

        return (
        <div
          key={image.id || index}
          className={clsx('media-item', {
            'media-item--selected': selected?.id === image?.id,
            'media-item--uploading': !Boolean(image?.id)
          })}
          onClick={() => onSelect(image)}
        >
          {image?.id && (
            <div className='media-item__checkbox'>
              {selected?.id === image.id && <LuCheck aria-hidden='true' />}
            </div>
          )}

          <div className='media-item__image-wrapper'>
            <Image
              width={width}
              height={height}
              src={image.url}
              alt={(displayName || 'image').slice(0, 10)}
              unoptimized={isLocalImageUrl(image.url)}
            />
          </div>

          <div className='media-item__info'>
            <div className='media-item__name'>
              {(displayName || 'Untitled').slice(0, 20)}
            </div>
            <div className='media-item__details'>
              <span>{image?.format?.toUpperCase()}</span>
              <span> • </span>
              <span>
                {width} x {height}
              </span>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default MediaGallery;
