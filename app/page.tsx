import React from "react";
import { Header } from "@/components/navigation/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { CuratedDrop } from "@/components/home/CuratedDrop";
import { TactileFabricLab } from "@/components/home/TactileFabricLab";
import { EditorialJournal } from "@/components/home/EditorialJournal";
import { Footer } from "@/components/navigation/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CuratedDrop />
        <TactileFabricLab />
        <EditorialJournal />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

