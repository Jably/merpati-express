// src/app/page.tsx
'use client';

import { RegistrationForm } from '@/components/RegistrationForm';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Home from "@/components/Home"

export default function Page() {
  useEffect(() => {
    // Cleanup
    return () => {  
    };
  }, []);

  return (
    <>
     <Navbar/>
     <Home />
    </>
  );
}

