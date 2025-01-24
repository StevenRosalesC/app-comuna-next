import Image from "next/image";
import Link from "next/link";
import { NoticeCard } from "../notices/notice-card";

export default function NoticesView() {
  return (
    <section className="dark:bg-gray-100 dark:text-gray-800">
      <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
        <Link rel="noopener noreferrer" href="/notices/test" className="block max-w-sm gap-3 mx-auto sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 dark:bg-gray-50">
          <Image width={1920} height={1080} alt="" src="https://ik.imagekit.io/stevenrosales/app-comuna/bc.jpg?updatedAt=1737682943108" className="object-cover w-full h-64 rounded sm:h-96 lg:col-span-7 dark:bg-gray-500" />
          <div className="p-6 space-y-2 lg:col-span-5">
            <h3 className="text-2xl font-semibold sm:text-4xl group-hover:underline group-focus:underline">Noster tincidunt reprimique ad pro</h3>
            <span className="text-xs dark:text-gray-600">{
              new Date().toLocaleDateString('es-ES', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}</span>
            <p>Ei delenit sensibus liberavisse pri. Quod suscipit no nam. Est in graece fuisset, eos affert putent doctus id.</p>
          </div>
        </Link>
        <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {
            Array.from({ length: 6 }).map((_, index) => (
              <NoticeCard key={index} />
            ))
          }
        </div>
        <div className="flex justify-center">
          <button type="button" className="px-6 py-3 text-sm rounded-md hover:underline dark:bg-gray-50 dark:text-gray-600">Load more posts...</button>
        </div>
      </div>
    </section>
  )
}