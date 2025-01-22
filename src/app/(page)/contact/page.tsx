import ContactView from "@/components/views/contact.view";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Contacto',
  description: 'Sitio web de la comuna Bambil Collao.'
};

export default function aboutPage() {
  return (
    <>
      <ContactView />
    </>
  )
}