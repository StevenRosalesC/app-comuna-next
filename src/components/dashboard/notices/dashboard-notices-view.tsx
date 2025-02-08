'use client';
import { useEffect, useState } from 'react';
// import EditForm from "@/app/dashboard/notices/_components/EditForm";
// import Button from "@/components/TiptapEditor/components/ui/Button";
// import Link from "next/link";

import '../../../app/dashboard/notices/style.scss';
import { getRelativeTime } from '@/utils/date';
import Link from 'next/link';
import { getAllNotices } from '@/services/notices';
import { Card } from '@/components/ui/card';

interface Notice {
  id: string;
  title: string;
  description: string;
  image: string;
  content: string;
  createdAt: string;
}

export default function DashboardNoticesView() {
  const [notices, setNotices] = useState<Notice[]>([]);

  const getNotices = async () => {
    const response = await getAllNotices();
    setNotices(response);
  };

  useEffect(() => {
    getNotices();
  }, []);

  return (
    // <div className="max-w-[56rem] w-full mx-auto py-10 px-6">

    //   {/* <Link href="/dashboard/notices/post-ssr" passHref>
    //     <Button>
    //       Preview
    //     </Button>
    //   </Link>
    //   <EditForm /> */}
    // </div>
    <section>
      <h3 className='text-2xl font-bold'>Noticias</h3>
      {notices.length > 0 &&
        notices.map((notice) => (
          <Link key={notice.id} href={`/dashboard/notices/${notice.id}`}>
            <Card className=' mt-4 rounded-lg p-6 shadow-md'>
              <h4 className='text-lg font-bold hover:underline'>
                {notice.title}
              </h4>
              <p className=''>{notice.description}</p>
              <p className='text-sm'>{getRelativeTime(notice.createdAt)}</p>
            </Card>
          </Link>
        ))}
    </section>
  );
}
