import { Button } from '@/components/ui/button';

export default function LoadingPage() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Button type='button' disabled>
        <div className='m-[10px] flex items-center justify-center'>
          <div className='h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-t-transparent'></div>
          <div className='ml-2'>
            {' '}
            Espere un momento... <div></div>
          </div>
        </div>
      </Button>
    </div>
  );
}
