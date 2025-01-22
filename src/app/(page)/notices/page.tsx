import NoticesView from "@/components/views/notices.view";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Noticias',
  description: 'Sitio web de la comuna Bambil Collao.'
};

export default function aboutPage() {
  return (
    <>
      <NoticesView />
    </>
  )
}