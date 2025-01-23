import { FooterSection } from "@/components/page/footer-section";
import { NavBar } from "@/components/page/nav-bar"
import { Metadata } from "next";
import React from "react"
export const metadata: Metadata = {
  title: 'Comuna Bambil Collao | Inicio',
  description: 'Sitio web de la comuna Bambil Collao.'
};

interface Props {
  children: React.ReactNode,
}

export default function Layout({ children }: Props) {

  return (
    <>
      <NavBar
      />
      <div className="container mx-auto px-5">
        {children}
      </div>
      <FooterSection />

    </>
  )
}