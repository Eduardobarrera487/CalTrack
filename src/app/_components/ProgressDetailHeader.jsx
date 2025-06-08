'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProgressDetailHeader() {
  return (
    <header className="w-full max-w-md h-16 relative bg-white border-b border-gray-200 flex items-center px-6">
      <Link href="/pages/calories">
        <div className="w-8 h-8 flex items-center justify-center">
          <ArrowLeft className="text-blue-900 w-5 h-5" />
        </div>
      </Link>
      <h1 className="ml-4 text-gray-900 text-xl font-semibold font-inter">
        Progreso de Peso
      </h1>
    </header>
  );
}
