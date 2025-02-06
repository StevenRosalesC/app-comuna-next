import DashboardNoticesView from "@/components/dashboard/notices/dashboard-notices-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Noticias',
  description: 'Sitio web de la comuna Bambil Collao.'
};


export default function EditPage() {
  return (
    <div className="max-w-[56rem] w-full mx-auto py-10 px-6">
      <DashboardNoticesView />
    </div>
  );
}
