"use client";
import { useEffect, useState } from "react";
// import EditForm from "@/app/dashboard/notices/_components/EditForm";
// import Button from "@/components/TiptapEditor/components/ui/Button";
// import Link from "next/link";

import "../../../app/dashboard/notices/style.scss";
import { getRelativeTime } from "@/utils/date";
import Link from "next/link";
import { getAllNotices } from "@/services/notices";

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
      <h3 className="text-2xl font-bold text-gray-800">
        Noticias
      </h3>
      {
        notices.length > 0 &&
        notices.map((notice) => (
          <Link key={notice.id} href={`/dashboard/notices/${notice.id}`}>
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
              <h4 className="text-xl font-bold text-gray-800">{notice.title}</h4>
              <p className="text-gray-600">{notice.description}</p>
              <p className="text-gray-500 text-sm">{getRelativeTime(notice.createdAt)}</p>
            </div>
          </Link>
        ))
      }

    </section>
  );
}
