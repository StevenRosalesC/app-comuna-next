"use client";

import EditForm from "@/app/dashboard/notices/_components/EditForm";
import Button from "@/components/TiptapEditor/components/ui/Button";
import Link from "next/link";



export default function DashboardNoticesView() {
  return (
    <div className="max-w-[56rem] w-full mx-auto py-10 px-6">

      <Link href="/dashboard/notices/post-ssr" passHref>
        <Button>
          Preview
        </Button>
      </Link>
      <EditForm />
    </div>
  );
}
