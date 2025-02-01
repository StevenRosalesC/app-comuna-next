import React from 'react';
interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Title = ({ children, className }: Props) => {
  return (
    <h1
      className={`mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl ${className}`}
    >
      {children}
    </h1>
  );
};
