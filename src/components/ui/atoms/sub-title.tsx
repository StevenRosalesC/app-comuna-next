import React from 'react';
interface Props {
  className?: string;
  children: React.ReactNode;
}

export const SubTitle = ({ children, className }: Props) => {
  return (
    <h2
      className={`mb-4 text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl ${className}`}
    >
      {children}
    </h2>
  );
};
