'use client';
import { DoubleArrowDownIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function FabScroll() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const threshold = document.documentElement.scrollHeight * 0.8;
      setIsVisible(scrollPosition < threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onScrollToBottom = () => {
    const scrollPosition =
      document.documentElement.scrollHeight * 0.75 - window.innerHeight;

    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-x-0 bottom-4 flex animate-bounce justify-center'>
      <Button
        onClick={onScrollToBottom}
        aria-label='Scroll to bottom'
        className='rounded-full border border-green-800 bg-transparent px-12 py-2 font-bold text-green-800 shadow-lg backdrop-blur-sm'
      >
        <DoubleArrowDownIcon />
      </Button>
    </div>
  );
}
