'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import useToc from '@/hooks/useToc';

const PostToc = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { items, activeId } = useToc({
    containerSelector: '.article-content',
    observerOptions: { rootMargin: '0px 0px -75% 0px', threshold: 1 }
  });
  const scrollToHeading = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    router.push(`${pathname}#${id}`, { scroll: false });
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (!items.length) return null;

  return (
    <div className='order-1 lg:order-3'>
      <div className='overflow-auto lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]'>
        <h2 className='text-sm font-bold uppercase'>En esta página</h2>
        <ul className='mt-4 space-y-3.5 text-sm'>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                paddingLeft: `${(item.level - 2) * 1}rem`
              }}
            >
              <Link
                href={`#${item.id}`}
                onClick={scrollToHeading(item.id)}
                className={`transition-colors hover:text-blue-600 ${
                  activeId === item.id ? 'text-blue-600' : ''
                }`}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostToc;
