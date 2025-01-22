import React from 'react'
interface Props {
  className?: string,
  children: React.ReactNode
}

export const Title = ({ children, className }: Props) => {
  return (
    <h1 className={`max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white ${className}`}>{
      children
    }</h1>
  )
}
