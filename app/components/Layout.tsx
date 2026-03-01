import { Header } from './Header';
import { Footer } from './Footer';
import { PDFPopup } from './PDFPopup';
import React from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      <PDFPopup />
    </div>
  );
}
