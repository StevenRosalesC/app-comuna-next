import Image from 'next/image'
import Link from 'next/link'

export const NoticeCard = () => {
  return (
    <Link rel="noopener noreferrer" href="/notices/test" className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-50 hidden sm:block">
      <Image width={100} height={100} alt="" role="presentation" className="object-cover w-full rounded h-44 dark:bg-gray-500" src="/not-found.webp" />
      <div className="p-6 space-y-2">
        <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">In usu laoreet repudiare legendos</h3>
        <span className="text-xs dark:text-gray-600">{
          new Date().toLocaleDateString('es-ES', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })
        }</span>
        <p>Mei ex aliquid eleifend forensibus, quo ad dicta apeirian neglegentur, ex has tantas percipit perfecto. At per tempor albucius perfecto, ei probatus consulatu patrioque mea, ei vocent delicata indoctum pri.</p>
      </div>
    </Link>
  )
}
