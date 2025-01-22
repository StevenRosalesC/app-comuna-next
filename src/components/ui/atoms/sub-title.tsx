import React from 'react'
interface Props {
  className?: string,
  children: React.ReactNode
}

export const SubTitle = ({ children, className }: Props) => {
  return (
    <h2 className={`mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white ${className}`}>
      {children}
    </h2>
  )
}
