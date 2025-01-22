import AboutView from "@/components/views/about.view";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Acerca de',
  description: 'Sitio web de la comuna Bambil Collao.'
};

export default function aboutPage() {
  return (
    <>
      <AboutView />
    </>
  )
}