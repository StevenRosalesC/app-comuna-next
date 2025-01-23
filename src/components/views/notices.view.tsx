import Image from "next/image";
import Link from "next/link";

export default function NoticesView() {
  return (
    <section className="dark:bg-gray-100 dark:text-gray-800">
      <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
        <Link rel="noopener noreferrer" href="/notices/test" className="block max-w-sm gap-3 mx-auto sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 dark:bg-gray-50">
          <Image width={100} height={100} alt="" src="/not-found.webp" className="object-cover w-full h-64 rounded sm:h-96 lg:col-span-7 dark:bg-gray-500" />
          <div className="p-6 space-y-2 lg:col-span-5">
            <h3 className="text-2xl font-semibold sm:text-4xl group-hover:underline group-focus:underline">Noster tincidunt reprimique ad pro</h3>
            <span className="text-xs dark:text-gray-600">February 19, 2021</span>
            <p>Ei delenit sensibus liberavisse pri. Quod suscipit no nam. Est in graece fuisset, eos affert putent doctus id.</p>
          </div>
        </Link>
        <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link rel="noopener noreferrer" href="/notices/test" className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-50">
            <Image width={100} height={100} alt="" role="presentation" className="object-cover w-full rounded h-44 dark:bg-gray-500" src="/not-found.webp" />
            <div className="p-6 space-y-2">
              <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">In usu laoreet repudiare legendos</h3>
              <span className="text-xs dark:text-gray-600">January 21, 2021</span>
              <p>Mei ex aliquid eleifend forensibus, quo ad dicta apeirian neglegentur, ex has tantas percipit perfecto. At per tempor albucius perfecto, ei probatus consulatu patrioque mea, ei vocent delicata indoctum pri.</p>
            </div>
          </Link>
          <Link rel="noopener noreferrer" href="/notices/test" className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-50">
            <Image width={100} height={100} alt="" role="presentation" className="object-cover w-full rounded h-44 dark:bg-gray-500" src="/not-found.webp" />
            <div className="p-6 space-y-2">
              <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">In usu laoreet repudiare legendos</h3>
              <span className="text-xs dark:text-gray-600">January 22, 2021</span>
              <p>Mei ex aliquid eleifend forensibus, quo ad dicta apeirian neglegentur, ex has tantas percipit perfecto. At per tempor albucius perfecto, ei probatus consulatu patrioque mea, ei vocent delicata indoctum pri.</p>
            </div>
          </Link>
          <Link rel="noopener noreferrer" href="/notices/test" className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-50">
            <Image width={100} height={100} alt="" role="presentation" className="object-cover w-full rounded h-44 dark:bg-gray-500" src="/not-found.webp" />
            <div className="p-6 space-y-2">
              <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">In usu laoreet repudiare legendos</h3>
              <span className="text-xs dark:text-gray-600">January 23, 2021</span>
              <p>Mei ex aliquid eleifend forensibus, quo ad dicta apeirian neglegentur, ex has tantas percipit perfecto. At per tempor albucius perfecto, ei probatus consulatu patrioque mea, ei vocent delicata indoctum pri.</p>
            </div>
          </Link>
          <Link rel="noopener noreferrer" href="/notices/test" className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-50 hidden sm:block">
            <Image width={100} height={100} alt="" role="presentation" className="object-cover w-full rounded h-44 dark:bg-gray-500" src="/not-found.webp" />
            <div className="p-6 space-y-2">
              <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">In usu laoreet repudiare legendos</h3>
              <span className="text-xs dark:text-gray-600">January 24, 2021</span>
              <p>Mei ex aliquid eleifend forensibus, quo ad dicta apeirian neglegentur, ex has tantas percipit perfecto. At per tempor albucius perfecto, ei probatus consulatu patrioque mea, ei vocent delicata indoctum pri.</p>
            </div>
          </Link>
          <Link rel="noopener noreferrer" href="/notices/test" className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-50 hidden sm:block">
            <Image width={100} height={100} alt="" role="presentation" className="object-cover w-full rounded h-44 dark:bg-gray-500" src="/not-found.webp" />
            <div className="p-6 space-y-2">
              <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">In usu laoreet repudiare legendos</h3>
              <span className="text-xs dark:text-gray-600">January 25, 2021</span>
              <p>Mei ex aliquid eleifend forensibus, quo ad dicta apeirian neglegentur, ex has tantas percipit perfecto. At per tempor albucius perfecto, ei probatus consulatu patrioque mea, ei vocent delicata indoctum pri.</p>
            </div>
          </Link>
          <Link rel="noopener noreferrer" href="/notices/test" className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-50 hidden sm:block">
            <Image width={100} height={100} alt="" role="presentation" className="object-cover w-full rounded h-44 dark:bg-gray-500" src="/not-found.webp" />
            <div className="p-6 space-y-2">
              <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">In usu laoreet repudiare legendos</h3>
              <span className="text-xs dark:text-gray-600">January 26, 2021</span>
              <p>Mei ex aliquid eleifend forensibus, quo ad dicta apeirian neglegentur, ex has tantas percipit perfecto. At per tempor albucius perfecto, ei probatus consulatu patrioque mea, ei vocent delicata indoctum pri.</p>
            </div>
          </Link>
        </div>
        <div className="flex justify-center">
          <button type="button" className="px-6 py-3 text-sm rounded-md hover:underline dark:bg-gray-50 dark:text-gray-600">Load more posts...</button>
        </div>
      </div>
    </section>
  )
}