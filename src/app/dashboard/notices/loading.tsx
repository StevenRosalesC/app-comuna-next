import Image from "next/image";

export default function loading() {
  return (
    <div className="relative flex justify-center items-center w-screen h-screen gap-5 dark:bg-gray-900">
      <div className="flex justify-center items-center">
        <div className="absolute animate-spin rounded-md h-32 w-32 border-4  border-emerald-500"></div>
        <Image
          src="/icon.webp"
          className="rounded-full h-28 w-28 animate-horizontal-spin"
          alt="Tailwindflex Logo"
          width={100}
          height={100}
        />
      </div>
      <span className="text-2xl text-emerald-500">Comuna Bambil Collao, Espere un momento...</span>

    </div>
  )
}