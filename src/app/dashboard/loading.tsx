import { Button } from "@/components/ui/button";

export default function loading() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <Button type="button" disabled>
        <div className="flex items-center justify-center m-[10px]">
          <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
          <div className="ml-2"> Espere un momento... <div>
          </div>
          </div>
        </div>
      </Button>
    </div>
  )
}
