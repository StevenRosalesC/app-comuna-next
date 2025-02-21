import { NEXT_PUBLIC_APP_URL } from "@/lib/env.config";
import { Metadata } from "next";
import HomePage from "../page";

export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Inicio',
  description:
    'Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
  category: 'Inicio',
  alternates: {
    canonical: `https://${NEXT_PUBLIC_APP_URL}/`,
  },
  openGraph: {
    title: 'Comuna Bambil Collao | Inicio',
    description:
      'Comuna Bambil Collao, ubicada en la provincia de Santa Elena, Parroquia Colonche.',
    url: `https://${NEXT_PUBLIC_APP_URL}/`
  }
};
export default HomePage;