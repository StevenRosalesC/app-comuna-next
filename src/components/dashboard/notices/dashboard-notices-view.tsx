'use client';

import { Card } from "@/components/ui/card";
import { getAllNotices } from "@/services/notices";
import { getRelativeTime } from "@/utils/date";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Notice } from "types/dashboard";

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
          <Link key={notice.newsId} href={`/dashboard/notices/${notice.newsId}`}>
            <Card className=' mt-4 rounded-lg p-6 shadow-md'>
              <h4 className='text-lg font-bold hover:underline'>
                {notice.title}
              </h4>
              <p className=''>{notice.description}</p>
              <p className='text-sm'>{getRelativeTime(notice.createdAt ?? '')}</p>
            </Card>
          </Link>
        ))}
    </section>
  );
}
