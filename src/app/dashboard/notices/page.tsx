import DashboardNoticesView from "@/components/dashboard/notices/dashboard-notices-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Bambil Collao APP | Noticias',
  description: 'Sitio web de la comuna Bambil Collao.'
};


export default function EditPage() {
  return (
    <DashboardNoticesView />
  );
}
